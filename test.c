#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MEMORY_SIZE 1024

typedef struct MemoryBlock {
    char status[10];
    int size;
} MemoryBlock;

MemoryBlock memoryBlocks[100];
int blockCount = 1;
int totalAllocated = 0;

void initializeMemory() {
    strcpy(memoryBlocks[0].status, "Free");
    memoryBlocks[0].size = MEMORY_SIZE;
}

void updateStatus() {
    printf("Total Memory: %d MB, Allocated: %d MB, Free: %d MB\n", MEMORY_SIZE, totalAllocated, MEMORY_SIZE - totalAllocated);
}

void printMemory() {
    for (int i = 0; i < blockCount; i++) {
        printf("%s (%d MB)\n", memoryBlocks[i].status, memoryBlocks[i].size);
    }
}

void mergeFreeBlocks() {
    for (int i = 0; i < blockCount - 1; i++) {
        if (strcmp(memoryBlocks[i].status, "Free") == 0 && strcmp(memoryBlocks[i + 1].status, "Free") == 0) {
            memoryBlocks[i].size += memoryBlocks[i + 1].size;
            for (int j = i + 1; j < blockCount - 1; j++) {
                memoryBlocks[j] = memoryBlocks[j + 1];
            }
            blockCount--;
            i--;
        }
    }
}

void allocateMemory(int size, const char* algorithm) {
    int index = -1;
    int bestSize = MEMORY_SIZE;
    int worstSize = 0;

    for (int i = 0; i < blockCount; i++) {
        if (strcmp(memoryBlocks[i].status, "Free") == 0 && memoryBlocks[i].size >= size) {
            if (strcmp(algorithm, "first-fit") == 0) {
                index = i;
                break;
            } else if (strcmp(algorithm, "best-fit") == 0 && memoryBlocks[i].size < bestSize) {
                index = i;
                bestSize = memoryBlocks[i].size;
            } else if (strcmp(algorithm, "worst-fit") == 0 && memoryBlocks[i].size > worstSize) {
                index = i;
                worstSize = memoryBlocks[i].size;
            }
        }
    }

    if (index == -1) {
        printf("No suitable block found for allocation.\n");
        return;
    }

    MemoryBlock block = memoryBlocks[index];
    if (block.size > size) {
        memoryBlocks[index].size = size;
        strcpy(memoryBlocks[index].status, "Allocated");

        for (int i = blockCount; i > index + 1; i--) {
            memoryBlocks[i] = memoryBlocks[i - 1];
        }
        strcpy(memoryBlocks[index + 1].status, "Free");
        memoryBlocks[index + 1].size = block.size - size;
        blockCount++;
    } else {
        strcpy(memoryBlocks[index].status, "Allocated");
    }

    totalAllocated += size;
    updateStatus();
    printMemory();
}

void deallocateMemory(int size) {
    for (int i = 0; i < blockCount; i++) {
        if (strcmp(memoryBlocks[i].status, "Allocated") == 0 && memoryBlocks[i].size == size) {
            strcpy(memoryBlocks[i].status, "Free");
            totalAllocated -= size;
            mergeFreeBlocks();
            updateStatus();
            printMemory();
            return;
        }
    }
    printf("No allocated block of the specified size found.\n");
}

void resetMemory() {
    blockCount = 1;
    totalAllocated = 0;
    initializeMemory();
    updateStatus();
    printMemory();
}

int main() {
    initializeMemory();
    updateStatus();
    printMemory();

    int choice, size;
    char algorithm[10];

    while (1) {
        printf("\n1. Allocate Memory\n2. Deallocate Memory\n3. Reset Memory\n4. Exit\nEnter your choice: ");
        scanf("%d", &choice);

        switch (choice) {
            case 1:
                printf("Enter block size (MB): ");
                scanf("%d", &size);
                printf("Enter algorithm (first-fit, best-fit, worst-fit): ");
                scanf("%s", algorithm);
                allocateMemory(size, algorithm);
                break;
            case 2:
                printf("Enter block size (MB): ");
                scanf("%d", &size);
                deallocateMemory(size);
                break;
            case 3:
                resetMemory();
                break;
            case 4:
                exit(0);
            default:
                printf("Invalid choice.\n");
        }
    }

    return 0;
}
