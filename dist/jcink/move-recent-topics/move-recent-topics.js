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
            `New parent for recent topics could not be found, expected element with ID ${parentId}`
        );
    }

    if (recentTopics && parent) {
        parent.appendChild(recentTopics);
    }
})();
