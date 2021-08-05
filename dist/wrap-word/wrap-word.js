/*
MIT License

Modified work copyright (c) 2021 Coding Camp and other contributors
Original work copyright (c) 2021 by Mario Vidov (https://codepen.io/mel/pen/jLEKH)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

(function () {
    class Mode {
        constructor(index, wrapperClass) {
            this.index = index;
            this.wrapperClass = `${sharedWrapperClass} ${wrapperClass}`;

            if (index >= 0) {
                this.isForwardSearching = true;
            } else {
                this.isForwardSearching = false;
            }
        }
    }

    const triggerSelector = "[data-trigger-word-wrap]";
    const triggerJs = "triggerWordWrap";

    const targets = document.querySelectorAll(triggerSelector);

    const sharedWrapperClass = "js-wrapped-word";
    const modes = {
        first: new Mode(0, "--first-word"),
        last: new Mode(-1, "--last-word"),
    };

    for (const target of targets) {
        const selectedModes = target.dataset[triggerJs].trim().split(/\s+/);

        for (const selectedMode of selectedModes) {
            if (modes.hasOwnProperty(selectedMode)) {
                const mode = modes[selectedMode];

                try {
                    const word = getWord(target, mode);
                    const wordWrapped = wrapWord(word, mode);
                    const textNode = getContainingTextNode(
                        target,
                        word,
                        mode.isForwardSearching
                    );

                    injectWrapper(
                        textNode,
                        word,
                        wordWrapped,
                        mode.isForwardSearching
                    );
                } catch (error) {
                    console.error(error);
                }
            } else if (selectedMode === "") {
                console.error(
                    `Found empty trigger on %o
At least one mode must be specified, options are: %o`,
                    target,
                    Object.keys(modes)
                );
            } else {
                console.error('Unsupported mode "%s" found', selectedMode);
            }
        }
    }

    function getWord(parent, mode) {
        const viewableContent = parent.innerText;
        let word;

        if (/\S/.test(viewableContent)) {
            const words = viewableContent.trim().split(/\s+/);

            if (mode.isForwardSearching) {
                word = words[mode.index];
            } else {
                word = words[words.length + mode.index];
            }
        } else {
            console.error(
                "No visible, non-whitespace content in targeted element %o",
                parent
            );
            throw "getWord() failed";
        }

        if (!word) {
            console.error("Word could not be retrieved from %o", parent);
            throw "getWord() failed";
        }

        return word;
    }

    function wrapWord(word, mode) {
        return `<span class="${mode.wrapperClass}">${word}</span>`;
    }

    function getContainingTextNode(parent, searchFor, isForwardSearching) {
        let childNodes = Array.from(parent.childNodes);

        if (!isForwardSearching) {
            childNodes.reverse();
        }

        for (const child of childNodes) {
            const searchForRegExp = new RegExp(searchFor, "i");

            if (
                searchForRegExp.test(child.nodeValue) ||
                searchForRegExp.test(child.innerText)
            ) {
                // prefer nodeName over nodeType for readability
                if (child.nodeName === "#text") {
                    return child;
                } else {
                    return getContainingTextNode(
                        child,
                        searchFor,
                        isForwardSearching
                    );
                }
            }
        }

        return;
    }

    function injectWrapper(node, word, wordWrapped, isForwardSearching) {
        /*
        lots of helpful technique advice for this bit:
        https://stackoverflow.com/questions/16662393/insert-html-into-text-node-with-javascript#29301739
        */

        let lowerWord = word.toLowerCase();
        let wordRegExp = new RegExp(word, "i");
        let newNodeValue;

        if (isForwardSearching) {
            newNodeValue = node.nodeValue.replace(wordRegExp, wordWrapped);
        } else {
            const index = node.nodeValue.toLowerCase().lastIndexOf(lowerWord);
            const valueStart = node.nodeValue.substring(0, index);
            let valueEnd = node.nodeValue.substring(index);

            valueEnd = valueEnd.replace(wordRegExp, wordWrapped);
            newNodeValue = valueStart + valueEnd;
        }

        const tempElement = document.createElement("div");

        node.parentNode.insertBefore(tempElement, node);
        tempElement.insertAdjacentHTML("afterend", newNodeValue);

        tempElement.remove();
        node.remove();
    }
})();
