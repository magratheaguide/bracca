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
        const COPYABLE_TEXT = TARGET.innerText;

        // let directParent = findDirectParent(TARGET, COPYABLE_TEXT);
        // console.log("direct parent =");
        // console.log(directParent);

        findTextNode(
            findDirectParent(TARGET, COPYABLE_TEXT),
            TARGET.classList.contains(TRIGGER_MODIFIER_FIRST),
            TARGET.classList.contains(TRIGGER_MODIFIER_LAST)
        );
    }

    function findDirectParent(parent, searchFor) {
        // console.log("parent = ");
        // console.log(parent);
        // console.log(parent.childNodes);

        // prefer nodeName over nodeType for readability
        if (
            parent.childNodes.length === 1 &&
            parent.firstChild.nodeName === "#text"
        ) {
            // console.log("returning =");
            // console.log(parent);
            return parent;
        }

        // console.log("searchFor =");
        // console.log(searchFor);
        for (const CHILD of parent.childNodes) {
            // console.log("CHILD.innerText =");
            // console.log(CHILD.innerText);

            if (CHILD.innerText === searchFor) {
                // console.log("starting another loop");
                return findDirectParent(CHILD, searchFor);
            }
        }

        // console.log("first parent is direct parent");
        return parent;
    }

    function findTextNode(parent, wrapFirstRequested, wrapLastRequested) {
        let targetNode;

        for (const CHILD of parent.childNodes) {
            // find the first child node that contains something other than whitespace
            if (CHILD.nodeName === "#text" && /\S/.test(CHILD.nodeValue)) {
                targetNode = CHILD;
                break;
            }
        }

        if (targetNode) {
            let parts = targetNode.nodeValue.trim().split(/\s+/);

            console.log(targetNode);
            console.log(parts);
            console.log(parent.innerHTML);

            if (wrapFirstRequested) {
                injectWrapper(parent, APPLY_CLASS_FIRST, parts.shift());
            }

            if (wrapLastRequested) {
                injectWrapper(parent, APPLY_CLASS_LAST, parts.pop());
            }
        } else {
            console.warn(
                "Text node with content other than whitespace could not be found in targeted element: %o",
                parent
            );
        }
    }

    function injectWrapper(parent, className, content) {
        const contentWrapped = `<span class="${className}">${content}</span>`;

        parent.innerHTML = parent.innerHTML.replace(content, contentWrapped);
    }
})();
