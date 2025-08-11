/*
MIT License

Modified work copyright (c) 2021 Cecilia Suderman (a.k.a. Daine a.k.a thewildmage).
Original work copyright (c) 2021 by Mario Vidov (https://codepen.io/mel/pen/jLEKH).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

"use strict";

(function () {
    // these must match each other!
    const triggerSelector = "[data-js-trigger-word-wrap]";
    const triggerKey = "jsTriggerWordWrap";

    // supported modes of operation
    const modes = {
        first: {
            index: 0,
            position: "first",
        },
        last: {
            index: -1,
            position: "last",
        },
    };

    for (const key in modes) {
        let mode = modes[key];

        if (mode.index >= 0) {
            mode.isForwardSearching = true;
        } else {
            mode.isForwardSearching = false;
        }
    }

    const targets = document.querySelectorAll(triggerSelector);

    for (const target of targets) {
        const selectedModes = target.dataset[triggerKey].trim().split(/\s+/);

        for (const selectedMode of selectedModes) {
            if (modes.hasOwnProperty(selectedMode)) {
                const mode = modes[selectedMode];

                try {
                    const word = getWord(target, mode);
                    const wordWrapped = wrapWord(word, mode);
                    const textNode = getContainingTextNode(
                        target,
                        word,
                        mode.isForwardSearching,
                    );

                    injectWrapper(
                        textNode,
                        word,
                        wordWrapped,
                        mode.isForwardSearching,
                    );
                } catch (exception) {
                    switch (exception.level) {
                        case "warn":
                            console.warn(
                                exception.message,
                                ...exception.substitutions,
                            );
                            break;
                        default:
                            console.error(
                                exception.message,
                                ...exception.substitutions,
                            );
                    }
                }
            } else if (selectedMode === "") {
                console.error(
                    `Found empty trigger on %o
At least one mode must be specified, options are: %o`,
                    target,
                    Object.keys(modes),
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
            throw {
                level: "warn",
                message:
                    "No visible, non-whitespace content in targeted element %o",
                substitutions: [parent],
            };
        }

        if (!word) {
            throw {
                level: "error",
                message: "Word could not be retrieved from %o",
                substitutions: [parent],
            };
        }

        return word;
    }

    function wrapWord(word, mode) {
        return `<span class="js-wrapped-word" data-word="${mode.position}">${word}</span>`;
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
                        isForwardSearching,
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
