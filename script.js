const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const resultDiv = document.getElementById("result");

// 🎯 Tier setup
const tiers = [
    { name: "Tier 0", chance: 35, color: "#555" },
    { name: "Tier 1", chance: 25, color: "#3498db" },
    { name: "Tier 2", chance: 18, color: "#2ecc71" },
    { name: "Tier 3", chance: 12, color: "#f1c40f" },
    { name: "Tier 4", chance: 10, color: "#e74c3c" },
];

// 🔄 Categories per tier
const categories = {
    "Tier 0": ["Semi"],
    "Tier 1": ["Semi"],
    "Tier 2": ["ARP", "Switch", "Semi"],
    "Tier 3": ["ARP", "Switch", "Semi"],
    "Tier 4": ["Shotgun", "ARP", "Switch", "Semi"]
};

// 🎁 Rewards (safe/custom names)
const rewards = {
    "Tier 1": {
        "Semi": ["street_pistol", "compact_defender", "urban_pistol"]
    },
    "Tier 2": {
        "ARP": ["banshee_pdw"],
        "Switch": ["ap_basic", "ap_flash"],
        "Semi": ["vintage_sidearm", "mk1_pistol"]
    },
    "Tier 3": {
        "ARP": ["assault_basic", "compact_rifle"],
        "Switch": ["ap_ext", "ap_flash"],
        "Semi": ["heavy_sidearm", "combat_pistol"]
    },
    "Tier 4": {
        "Shotgun": ["pump_mk2"],
        "ARP": ["assault_mk2", "special_rifle"],
        "Switch": ["ap_elite"],
        "Semi": ["elite_sidearm"]
    }
};

let total = tiers.reduce((sum, t) => sum + t.chance, 0);
let currentRotation = 0;

// 🎡 Draw wheel
function drawWheel(rotation = 0) {
    ctx.clearRect(0, 0, 500, 500);
    let angle = rotation;

    tiers.forEach(tier => {
        let slice = (tier.chance / total) * (2 * Math.PI);

        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + slice);
        ctx.fillStyle = tier.color;
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(angle + slice / 2);
        ctx.fillStyle = "#fff";
        ctx.fillText(tier.name, 120, 5);
        ctx.restore();

        angle += slice;
    });
}

// 🎯 Get tier from pointer
function getTier(rotation) {
    let angle = (2 * Math.PI - (rotation % (2 * Math.PI))) % (2 * Math.PI);
    let current = 0;

    for (let tier of tiers) {
        let slice = (tier.chance / total) * (2 * Math.PI);
        if (angle >= current && angle < current + slice) {
            return tier.name;
        }
        current += slice;
    }
}

// 🎡 Spin
function spinWheel() {
    spinBtn.disabled = true;
    let duration = 4000;
    let start = null;
    let spinAngle = Math.random() * 2000 + 2000;

    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    function animate(timestamp) {
        if (!start) start = timestamp;
        let progress = (timestamp - start) / duration;
        if (progress > 1) progress = 1;

        let eased = easeOut(progress);
        let rotation = (spinAngle * eased) * Math.PI / 180;

        currentRotation = rotation;
        drawWheel(rotation);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin(rotation);
        }
    }

    requestAnimationFrame(animate);
}

// 🎁 Final result
function finishSpin(rotation) {
    let tier = getTier(rotation);

    let catList = categories[tier];
    let category = catList[Math.floor(Math.random() * catList.length)];

    let rewardList = rewards[tier]?.[category] || ["basic_reward"];
    let reward = rewardList[Math.floor(Math.random() * rewardList.length)];

    resultDiv.innerHTML = `
        🎉 Tier: <b>${tier}</b><br>
        🔄 Category: <b>${category}</b><br>
        🎁 Reward: <b>${reward}</b>
    `;

    spinBtn.disabled = false;
}

// Init
drawWheel();
spinBtn.addEventListener("click", spinWheel);
