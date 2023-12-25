/*
MIT License

Copyright (c) 2021 Cecilia Suderman (a.k.a. Daine a.k.a thewildmage).

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

"use strict";

(function () {
    const parentId = "js-recent-topics-parent";

    const recentTopics = document.getElementById("recent-topics");
    const parent = document.getElementById(parentId);

    if (!recentTopics) {
        console.error("#recent-topics could not be found");
    }

    if (!parent) {
        console.error(
            `New parent for recent topics could not be found, expected element with ID ${parentId}`,
        );
    }

    if (recentTopics && parent) {
        parent.appendChild(recentTopics);
    }
})();
