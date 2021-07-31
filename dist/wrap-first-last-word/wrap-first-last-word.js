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
        }

        get isForwardSearching() {
            return this._isForwardSearching;
        }

        get word() {
            return this._word;
        }

        get wordWrapped() {
            return this._wordWrapped;
        }

        configureWord(wordArray) {
            if (this.index >= 0) {
                this._word = wordArray[this.index];
                this._isForwardSearching = true;
            } else {
                this._word = wordArray[wordArray.length + this.index];
                this._isForwardSearching = false;
            }
            this._wordWrapped = this.wrapWord(this._word);
        }

        wrapWord(word) {
            return `<span class="${this.wrapperClass}">${word}</span>`;
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
        const viewableContent = target.innerText;

        if (/\S/.test(viewableContent)) {
            const allWords = viewableContent.trim().split(/\s+/);
            const selectedModes = target.dataset[triggerJs].trim().split(/\s+/);

            for (const selectedMode of selectedModes) {
                if (modes.hasOwnProperty(selectedMode)) {
                    let mode = modes[selectedMode];

                    mode.configureWord(allWords);
                    console.debug(mode);

                    let node = findContainingNode(
                        target,
                        mode.word,
                        mode.isForwardSearching
                    );
                    injectWrapper(
                        node,
                        mode.word,
                        mode.wordWrapped,
                        mode.isForwardSearching
                    );
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
        } else {
            console.warn(
                "No visible, non-whitespace content in targeted element %o",
                target
            );
        }
    }

    function findContainingNode(parent, searchFor, isForwardSearching) {
        let childNodes = Array.from(parent.childNodes);

        if (!isForwardSearching) {
            childNodes.reverse();
        }

        for (const child of childNodes) {
            const searchForRegExp = new RegExp(searchFor);

            if (
                searchForRegExp.test(child.nodeValue) ||
                searchForRegExp.test(child.innerText)
            ) {
                // prefer nodeName over nodeType for readability
                if (child.nodeName === "#text") {
                    return child;
                } else {
                    return findContainingNode(child, searchFor);
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

        let newNodeValue;

        if (isForwardSearching) {
            newNodeValue = node.nodeValue.replace(word, wordWrapped);
        } else {
            const index = node.nodeValue.lastIndexOf(word);
            const valueStart = node.nodeValue.substring(0, index);
            let valueEnd = node.nodeValue.substring(index);

            valueEnd = valueEnd.replace(word, wordWrapped);
            newNodeValue = valueStart + valueEnd;
        }

        const tempElement = document.createElement("div");

        node.parentNode.insertBefore(tempElement, node);
        tempElement.insertAdjacentHTML("afterend", newNodeValue);

        tempElement.remove();
        node.remove();
    }
})();
