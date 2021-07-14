(function () {
    const RECENT_TOPICS = document.getElementById("recent-topics");
    const RECENT_TOPICS_PARENT = document.getElementById("js-recent-topics-parent");

    if (!RECENT_TOPICS) {
        console.error("#recent-topics could not be found");
    }

    if (!RECENT_TOPICS_PARENT) {
        console.error(`New recent topics parent could not be found, expected element with ID ${RECENT_TOPICS_PARENT_ID}`);
    }

    if (RECENT_TOPICS && RECENT_TOPICS_PARENT) {
        RECENT_TOPICS_PARENT.appendChild(RECENT_TOPICS);
    }
})();
