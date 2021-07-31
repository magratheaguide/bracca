/*
MIT License

Modified work copyright (c) 2021 Coding Camp and other contributors
Original work copyright (c) 2021 by Mario Vidov (https://codepen.io/mel/pen/jLEKH)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

(function () {
    const APPLY_CLASS_FIRST = "js-first-word";
    const APPLY_CLASS_LAST = "js-last-word";

    const TRIGGER_CLASS = "js-wrap-first-last-word";
    const TRIGGER_MODIFIER_FIRST = "--js-wrap-first";
    const TRIGGER_MODIFIER_LAST = "--js-wrap-last";

    const TARGETS = document.getElementsByClassName(TRIGGER_CLASS);

    for (const TARGET of TARGETS) {
        const viewableContent = TARGET.innerText;

        if (/\S/.test(viewableContent)) {
            const parts = viewableContent.trim().split(/\s+/);
            const firstWord = parts.shift();
            const lastWord = parts.pop();

            if (TARGET.classList.contains(TRIGGER_MODIFIER_FIRST)) {
                let firstNode = findContainingNode(TARGET, firstWord, true);
                injectWrapper(firstNode, APPLY_CLASS_FIRST, firstWord, "first");
            }

            if (TARGET.classList.contains(TRIGGER_MODIFIER_LAST)) {
                let lastNode = findContainingNode(TARGET, lastWord, false);
                injectWrapper(lastNode, APPLY_CLASS_LAST, lastWord, "last");
            }

            if (
                !TARGET.classList.contains(TRIGGER_MODIFIER_FIRST) &&
                !TARGET.classList.contains(TRIGGER_MODIFIER_LAST)
            ) {
                console.error(
                    `Missing position modifier class on %o

Must specify first and/or last word to be wrapped using "%s" or "%s" classes`,
                    TARGET,
                    APPLY_CLASS_FIRST,
                    APPLY_CLASS_LAST
                );
            }
        } else {
            console.warn(
                "No visible, non-whitespace content in targeted element %o",
                TARGET
            );
        }
    }

    function findContainingNode(parent, searchFor, isForwardSearch = true) {
        let childNodes = Array.from(parent.childNodes);

        if (!isForwardSearch) {
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

    function injectWrapper(node, className, content, position) {
        /*
        lots of helpful technique advice for this bit:
        https://stackoverflow.com/questions/16662393/insert-html-into-text-node-with-javascript#29301739
        */

        const contentWrapped = `<span class="${className}">${content}</span>`;
        let newNodeValue;

        switch (position) {
            case "first":
                newNodeValue = node.nodeValue.replace(content, contentWrapped);
                break;
            case "last":
                const index = node.nodeValue.lastIndexOf(content);
                const valueStart = node.nodeValue.substring(0, index);
                let valueEnd = node.nodeValue.substring(index);

                valueEnd = valueEnd.replace(content, contentWrapped);
                newNodeValue = valueStart + valueEnd;

                break;
            default:
                console.error("invalid position provided to injectWrapper()");
        }

        const tempElement = document.createElement("div");

        node.parentNode.insertBefore(tempElement, node);
        tempElement.insertAdjacentHTML("afterend", newNodeValue);

        tempElement.remove();
        node.remove();
    }
})();
