const counters = document.querySelectorAll(".counter");
const cards = document.querySelectorAll(".card");

const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");

const topButton = document.getElementById("topButton");

const STORAGE_KEY = "morningAzkarProgress";

let saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function updateProgress() {

    let done = 0;

    cards.forEach(card => {
        if (card.classList.contains("done"))
            done++;
    });

    let percent = Math.round((done / cards.length) * 100);

    progressFill.style.width = percent + "%";
    progressPercent.textContent = percent + "%";

}

counters.forEach((button, index) => {

    let original = Number(button.dataset.count);

    let current = saved[index] ?? original;

    button.textContent = current;

    if (current <= 0) {

        current = 0;

        button.textContent = "✓";

        button.disabled = true;

        cards[index].classList.add("done");

    }

    button.addEventListener("click", () => {

        if (current <= 0) return;

        current--;

        saved[index] = current;

        save();

        button.animate([
            {
                transform: "scale(1)"
            },
            {
                transform: "scale(.85)"
            },
            {
                transform: "scale(1.15)"
            },
            {
                transform: "scale(1)"
            }
        ], {
            duration: 250
        });

        if (current <= 0) {

            button.textContent = "✓";

            button.disabled = true;

            cards[index].classList.add("done");

            cards[index].animate([
                {
                    transform: "scale(.95)"
                },
                {
                    transform: "scale(1.02)"
                },
                {
                    transform: "scale(1)"
                }
            ], {
                duration: 400
            });

        } else {

            button.textContent = current;

        }

        updateProgress();

    });

});

updateProgress();

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        topButton.style.display = "block";

    } else {

        topButton.style.display = "none";

    }

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

window.addEventListener("load", () => {

    document.body.animate([
        {
            opacity: 0,
            transform: "translateY(30px)"
        },
        {
            opacity: 1,
            transform: "translateY(0)"
        }
    ], {
        duration: 700,
        easing: "ease-out"
    });

});
// =========================================
// Reset Progress Button
// =========================================

const resetButton = document.createElement("button");

resetButton.textContent = "🔄 Reset Progress";
resetButton.id = "resetButton";

document.body.appendChild(resetButton);

Object.assign(resetButton.style, {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    padding: "12px 20px",
    border: "none",
    borderRadius: "12px",
    background: "#ef4444",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,.3)",
    zIndex: "999"
});

resetButton.addEventListener("mouseenter", () => {
    resetButton.style.transform = "scale(1.05)";
});

resetButton.addEventListener("mouseleave", () => {
    resetButton.style.transform = "scale(1)";
});

resetButton.addEventListener("click", () => {

    if (!confirm("Reset all progress on this page?")) return;

    localStorage.removeItem(STORAGE_KEY);

    location.reload();

});