const examples = {
    scope: {
        terms: "Project includes 5 static social media posts and 2 rounds of revisions. Delivery within 7 business days after receiving all content. Animated videos and additional posts are not included in this package.",
        message: "The posts look good! Could you also make 3 animated reels and keep revising until we're completely happy? We'd like to keep the original price."
    },
    policy: {
        terms: "Returns are accepted within 14 days of delivery for unused items in their original packaging. Damaged items should be reported within 48 hours with photos. Return shipping is paid by the customer unless the item arrived damaged. Refunds are processed after inspection.",
        message: "I bought this two weeks ago and have used it several times. I'd like a full refund. Can you send the money back today?"
    }
};

const modeInput = document.getElementById("mode");
const terms = document.getElementById("terms");
const message = document.getElementById("customer-message");
const form = document.getElementById("analysis-form");
const button = document.getElementById("analyze-button");
const results = document.getElementById("results");
const errorBox = document.getElementById("error-box");

function setMode(mode) {
    modeInput.value = mode;

    document.querySelectorAll(".tab").forEach(tab => {
        const active = tab.dataset.mode === mode;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
    });

    document.getElementById("terms-label").textContent =
        mode === "scope" ? "Original agreement" : "Your customer policy";

    document.getElementById("terms-help").textContent =
        mode === "scope"
            ? "Paste the agreed deliverables, revision limits, timeline, or exclusions."
            : "Paste the relevant refund, return, exchange, or service policy.";

    terms.placeholder = mode === "scope"
        ? "Describe what was agreed..."
        : "Describe your policy...";

    terms.value = "";
    message.value = "";
    updateCounts();

    results.hidden = true;
    errorBox.hidden = true;
}

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
});

document.getElementById("load-example").addEventListener("click", () => {
    const example = examples[modeInput.value];
    terms.value = example.terms;
    message.value = example.message;
    updateCounts();
    errorBox.hidden = true;
});

function updateCounts() {
    document.getElementById("terms-count").textContent =
        `${terms.value.length} / 12000`;
    document.getElementById("message-count").textContent =
        `${message.value.length} / 12000`;
}

terms.addEventListener("input", updateCounts);
message.addEventListener("input", updateCounts);

function addListItems(id, items, fallback) {
    const list = document.getElementById(id);
    list.replaceChildren();

    const values = Array.isArray(items) && items.length ? items : [fallback];

    values.forEach(value => {
        const item = document.createElement("li");
        item.textContent = String(value);
        list.appendChild(item);
    });
}

function formatClassification(value) {
    const labels = {
        appears_in_scope: "Appears in scope",
        potentially_out_of_scope: "Potentially out of scope",
        ambiguous: "Ambiguous",
        appears_consistent_with_policy: "Appears consistent with policy",
        potentially_outside_policy: "Potentially outside policy",
        policy_unclear: "Policy unclear"
    };

    return labels[value] || String(value).replaceAll("_", " ");
}

function displayResult(data) {
    const badge = document.getElementById("classification");
    badge.textContent = formatClassification(data.classification);
    badge.className = "classification";

    if (["appears_in_scope", "appears_consistent_with_policy"].includes(data.classification)) {
        badge.classList.add("good");
    } else if (["potentially_out_of_scope", "potentially_outside_policy"].includes(data.classification)) {
        badge.classList.add("warn");
    }

    document.getElementById("summary").textContent = data.summary;
    addListItems("evidence-list", data.evidence, "No specific supporting clause was identified.");
    addListItems("uncertainty-list", data.uncertainties, "Review the terms carefully before acting.");
    document.getElementById("next-step").textContent = data.suggested_next_step;
    document.getElementById("draft-reply").textContent = data.draft_reply;

    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", async event => {
    event.preventDefault();
    errorBox.hidden = true;
    results.hidden = true;
    button.disabled = true;
    button.querySelector("span:first-child").textContent = "Analyzing...";

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                mode: modeInput.value,
                terms: terms.value,
                customer_message: message.value,
                tone: document.getElementById("tone").value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Analysis failed. Please try again.");
        }

        displayResult(data);
    } catch (error) {
        errorBox.textContent = error.message || "Unable to reach Boundary.";
        errorBox.hidden = false;
    } finally {
        button.disabled = false;
        button.querySelector("span:first-child").textContent = "Check the boundary";
    }
});

document.getElementById("copy-reply").addEventListener("click", async () => {
    const text = document.getElementById("draft-reply").textContent;
    const copyButton = document.getElementById("copy-reply");

    try {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = "Copied ✓";
        setTimeout(() => {
            copyButton.textContent = "Copy reply ↗";
        }, 1500);
    } catch {
        copyButton.textContent = "Select and copy manually";
    }
});
