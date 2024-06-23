const memorySize = 1024;
let memoryBlocks = [{ status: "Free", size: memorySize }];
let totalAllocated = 0;

function updateStatus() {
    const statusText = `Total Memory: ${memorySize} MB, Allocated: ${totalAllocated} MB, Free: ${memorySize - totalAllocated} MB`;
    document.getElementById("status-text").innerText = statusText;
}

function drawMemory() {
    const canvas = document.getElementById("memoryCanvas");
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const blockHeight = height / memoryBlocks.length;
    
    ctx.clearRect(0, 0, width, height);

    memoryBlocks.forEach((block, index) => {
        const color = block.status === "Free" ? "#4CAF50" : "#FF5733";
        ctx.fillStyle = color;
        ctx.fillRect(0, index * blockHeight, (block.size / memorySize) * width, blockHeight);
        ctx.fillStyle = "white";
        ctx.font = "14px Roboto";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`${block.status} (${block.size} MB)`, (block.size / memorySize) * width / 2, (index + 0.5) * blockHeight);
    });
}

function allocate() {
    const size = parseInt(document.getElementById("size").value);
    const algorithm = document.getElementById("algorithm").value;

    if (isNaN(size) || size <= 0) {
        alert("Block size must be a positive integer.");
        return;
    }

    let allocateIndex = -1;
    let blockSize = memorySize;

    switch (algorithm) {
        case "first-fit":
            for (let i = 0; i < memoryBlocks.length; i++) {
                if (memoryBlocks[i].status === "Free" && memoryBlocks[i].size >= size) {
                    allocateIndex = i;
                    break;
                }
            }
            break;
        case "best-fit":
            for (let i = 0; i < memoryBlocks.length; i++) {
                if (memoryBlocks[i].status === "Free" && memoryBlocks[i].size >= size && memoryBlocks[i].size < blockSize) {
                    allocateIndex = i;
                    blockSize = memoryBlocks[i].size;
                }
            }
            break;
        case "worst-fit":
            for (let i = 0; i < memoryBlocks.length; i++) {
                if (memoryBlocks[i].status === "Free" && memoryBlocks[i].size >= size && memoryBlocks[i].size > blockSize) {
                    allocateIndex = i;
                    blockSize = memoryBlocks[i].size;
                }
            }
            break;
    }

    if (allocateIndex === -1) {
        alert("No suitable block found for allocation.");
        return;
    }

    const block = memoryBlocks[allocateIndex];
    if (block.size > size) {
        memoryBlocks.splice(allocateIndex, 1, { status: "Allocated", size: size }, { status: "Free", size: block.size - size });
    } else {
        memoryBlocks[allocateIndex].status = "Allocated";
    }

    totalAllocated += size;
    updateStatus();
    drawMemory();
}

function deallocate() {
    const size = parseInt(document.getElementById("size").value);

    if (isNaN(size) || size <= 0) {
        alert("Block size must be a positive integer.");
        return;
    }

    for (let i = 0; i < memoryBlocks.length; i++) {
        if (memoryBlocks[i].status === "Allocated" && memoryBlocks[i].size === size) {
            memoryBlocks[i].status = "Free";
            totalAllocated -= size;
            mergeFreeBlocks();
            updateStatus();
            drawMemory();
            return;
        }
    }

    alert("No allocated block of the specified size found.");
}

function mergeFreeBlocks() {
    for (let i = 0; i < memoryBlocks.length - 1; i++) {
        if (memoryBlocks[i].status === "Free" && memoryBlocks[i + 1].status === "Free") {
            memoryBlocks[i].size += memoryBlocks[i + 1].size;
            memoryBlocks.splice(i + 1, 1);
            i--;
        }
    }
}

function resetMemory() {
    memoryBlocks = [{ status: "Free", size: memorySize }];
    totalAllocated = 0;
    updateStatus();
    drawMemory();
}

window.onload = function () {
    const canvas = document.getElementById("memoryCanvas");
    canvas.width = document.querySelector(".memory-visualization").clientWidth;
    canvas.height = 400;
    updateStatus();
    drawMemory();
};

window.onresize = function () {
    const canvas = document.getElementById("memoryCanvas");
    canvas.width = document.querySelector(".memory-visualization").clientWidth;
    drawMemory();
};
