document.addEventListener("DOMContentLoaded", () => {
    const componentGrid = document.getElementById("component-grid");
    const componentModal = document.getElementById("component-modal");
    const closeModalButton = document.getElementById("close-modal-button");
    const modalComponentName = document.getElementById("modal-component-name");
    const modalItemList = document.getElementById("modal-item-list");
    const selectedComponentsSummary = document.getElementById("selected-components");

    let selectedConfiguration = {}; // Stores { componentType: selectedModelId }

    // --- DATA ---
    // Simplified data structure. In a real app, this would come from a backend/DB.
    const componentsData = {
        cpu: {
            name: "CPU",
            image: "images/cpu.png",
            models: [
                {
                    id: "cpu_intel_i7",
                    name: "Intel Core i7-13700K",
                    compatibleWith: { mainboard: ["mb_z790"] },
                    details: "Socket LGA1700",
                },
                {
                    id: "cpu_intel_i5",
                    name: "Intel Core i5-13600K",
                    compatibleWith: { mainboard: ["mb_z790", "mb_b760"] },
                    details: "Socket LGA1700",
                },
                {
                    id: "cpu_amd_r7",
                    name: "AMD Ryzen 7 7800X3D",
                    compatibleWith: { mainboard: ["mb_x670"] },
                    details: "Socket AM5",
                },
                {
                    id: "cpu_amd_r5",
                    name: "AMD Ryzen 5 7600X",
                    compatibleWith: { mainboard: ["mb_x670", "mb_b650"] },
                    details: "Socket AM5",
                },
            ],
        },
        mainboard: {
            name: "Mainboard",
            image: "images/mainboard.png",
            models: [
                {
                    id: "mb_z790",
                    name: "ASUS ROG STRIX Z790-E GAMING WIFI",
                    compatibleWith: { cpu: ["cpu_intel_i7", "cpu_intel_i5"], ram: ["ram_ddr5_32gb_5600"] },
                    details: "Z790 Chipset, DDR5",
                },
                {
                    id: "mb_b760",
                    name: "MSI PRO B760M-A WIFI DDR4",
                    compatibleWith: { cpu: ["cpu_intel_i5"], ram: ["ram_ddr4_32gb_3200"] },
                    details: "B760 Chipset, DDR4",
                },
                {
                    id: "mb_x670",
                    name: "Gigabyte X670 AORUS ELITE AX",
                    compatibleWith: { cpu: ["cpu_amd_r7", "cpu_amd_r5"], ram: ["ram_ddr5_32gb_5600"] },
                    details: "X670 Chipset, DDR5",
                },
                {
                    id: "mb_b650",
                    name: "ASRock B650 PG Lightning",
                    compatibleWith: { cpu: ["cpu_amd_r5"], ram: ["ram_ddr5_32gb_5600"] },
                    details: "B650 Chipset, DDR5",
                },
            ],
        },
        gpu: {
            name: "Card màn hình (GPU)",
            image: "images/gpu.png",
            models: [
                {
                    id: "gpu_rtx4080",
                    name: "NVIDIA GeForce RTX 4080",
                    compatibleWith: { psu: ["psu_850w", "psu_1000w"] },
                    details: "16GB GDDR6X",
                },
                {
                    id: "gpu_rtx4070",
                    name: "NVIDIA GeForce RTX 4070 Ti",
                    compatibleWith: { psu: ["psu_750w", "psu_850w", "psu_1000w"] },
                    details: "12GB GDDR6X",
                },
                {
                    id: "gpu_rx7900xtx",
                    name: "AMD Radeon RX 7900 XTX",
                    compatibleWith: { psu: ["psu_850w", "psu_1000w"] },
                    details: "24GB GDDR6",
                },
                {
                    id: "gpu_rx7800xt",
                    name: "AMD Radeon RX 7800 XT",
                    compatibleWith: { psu: ["psu_750w", "psu_850w"] },
                    details: "16GB GDDR6",
                },
            ],
        },
        ram: {
            name: "RAM",
            image: "images/ram.png",
            models: [
                {
                    id: "ram_ddr5_32gb_5600",
                    name: "Corsair Vengeance DDR5 32GB (2x16GB) 5600MHz",
                    compatibleWith: { mainboard: ["mb_z790", "mb_x670", "mb_b650"] },
                    details: "DDR5, 5600MHz CL36",
                },
                {
                    id: "ram_ddr4_32gb_3200",
                    name: "Kingston Fury Beast DDR4 32GB (2x16GB) 3200MHz",
                    compatibleWith: { mainboard: ["mb_b760"] },
                    details: "DDR4, 3200MHz CL16",
                },
                {
                    id: "ram_ddr5_16gb_5200",
                    name: "Crucial DDR5 16GB (2x8GB) 5200MHz",
                    compatibleWith: { mainboard: ["mb_z790", "mb_x670", "mb_b650"] },
                    details: "DDR5, 5200MHz CL40",
                },
            ],
        },
        ssd: {
            name: "Ổ cứng SSD",
            image: "images/ssd.png",
            models: [
                {
                    id: "ssd_nvme_1tb",
                    name: "Samsung 980 Pro 1TB NVMe PCIe 4.0",
                    compatibleWith: {},
                    details: "M.2 NVMe Gen4",
                },
                {
                    id: "ssd_nvme_2tb",
                    name: "WD Black SN850X 2TB NVMe PCIe 4.0",
                    compatibleWith: {},
                    details: "M.2 NVMe Gen4",
                },
                {
                    id: "ssd_sata_1tb",
                    name: "Crucial MX500 1TB SATA III",
                    compatibleWith: {},
                    details: '2.5" SATA III',
                },
            ],
        },
        hdd: {
            name: "Ổ cứng HDD",
            image: "images/hdd.png",
            models: [
                {
                    id: "hdd_2tb_7200",
                    name: "Seagate Barracuda 2TB 7200 RPM",
                    compatibleWith: {},
                    details: '3.5" SATA III',
                },
                { id: "hdd_4tb_5400", name: "WD Blue 4TB 5400 RPM", compatibleWith: {}, details: '3.5" SATA III' },
            ],
        },
        case: {
            name: "Case máy tính",
            image: "images/case.png",
            models: [
                {
                    id: "case_mid_atx",
                    name: "NZXT H510 Flow (Mid Tower ATX)",
                    compatibleWith: {},
                    details: "Hỗ trợ mainboard ATX",
                },
                {
                    id: "case_full_atx",
                    name: "Corsair 4000D Airflow (Mid Tower ATX)",
                    compatibleWith: {},
                    details: "Hỗ trợ mainboard ATX",
                },
                {
                    id: "case_mini_itx",
                    name: "Cooler Master NR200P (Mini ITX)",
                    compatibleWith: {},
                    details: "Hỗ trợ mainboard Mini-ITX",
                },
            ],
        },
        psu: {
            name: "Nguồn máy tính (PSU)",
            image: "images/psu.png",
            models: [
                {
                    id: "psu_750w",
                    name: "Corsair RM750x (750W Gold)",
                    compatibleWith: { gpu: ["gpu_rtx4070", "gpu_rx7800xt"] },
                    details: "80+ Gold, Fully Modular",
                },
                {
                    id: "psu_850w",
                    name: "Seasonic FOCUS GX-850 (850W Gold)",
                    compatibleWith: { gpu: ["gpu_rtx4080", "gpu_rtx4070", "gpu_rx7900xtx", "gpu_rx7800xt"] },
                    details: "80+ Gold, Fully Modular",
                },
                {
                    id: "psu_1000w",
                    name: "EVGA SuperNOVA 1000 G6 (1000W Gold)",
                    compatibleWith: { gpu: ["gpu_rtx4080", "gpu_rx7900xtx"] },
                    details: "80+ Gold, Fully Modular",
                },
            ],
        },
    };

    // --- INITIALIZATION ---
    function initializeComponentGrid() {
        componentGrid.innerHTML = ""; // Clear existing
        Object.keys(componentsData).forEach((componentType) => {
            const component = componentsData[componentType];
            const card = document.createElement("div");
            card.classList.add("component-card");
            card.dataset.componentType = componentType;

            let selectedModelNameHTML = "";
            let actionButtonsHTML = '<button class="select-btn">Chọn</button>';

            if (selectedConfiguration[componentType]) {
                const model = component.models.find((m) => m.id === selectedConfiguration[componentType]);
                if (model) {
                    selectedModelNameHTML = `<p class="selected-model">Đã chọn: ${model.name}</p>`;
                    actionButtonsHTML = `
                        <button class="select-btn">Thay đổi</button>
                        <button class="remove-selection-btn" data-component-type="${componentType}">Xoá lựa chọn</button>
                    `;
                }
            }

            card.innerHTML = `
                <img src="${component.image}" alt="${component.name}">
                <h4>${component.name}</h4>
                ${selectedModelNameHTML}
                <div class="action-buttons">
                    ${actionButtonsHTML}
                </div>
            `;
            card.querySelector(".select-btn").addEventListener("click", () => openModalForComponent(componentType));

            const removeBtn = card.querySelector(".remove-selection-btn");
            if (removeBtn) {
                removeBtn.addEventListener("click", () => removeSelectedComponentModel(componentType));
            }

            componentGrid.appendChild(card);
        });
        updateSelectedSummary();
    }

    // --- MODAL LOGIC ---
    function openModalForComponent(componentType) {
        modalComponentName.textContent = componentsData[componentType].name;

        populateModalItemList(componentType);
        componentModal.classList.add("is-visible"); // Changed to use class for CSS animation
    }

    function closeModal() {
        componentModal.classList.remove("is-visible"); // Changed to use class for CSS animation
        // It's good practice to delay clearing content until after the animation,
        // but for simplicity, we clear it immediately. If animations stutter,
        // consider using a setTimeout matching the transition duration.
        modalItemList.innerHTML = ""; // Clear list
    }

    function populateModalItemList(componentType) {
        modalItemList.innerHTML = ""; // Clear previous items
        const availableModels = getAvailableModels(componentType);

        if (availableModels.length === 0) {
            modalItemList.innerHTML = "<p>Không có model tương thích với lựa chọn hiện tại.</p>";
            return;
        }

        availableModels.forEach((model) => {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("modal-item");
            itemDiv.innerHTML = `
                <img src="${componentsData[componentType].image}" alt="${
                model.name
            }"> <!-- Placeholder, ideally model-specific image -->
                <div class="modal-item-info">
                    <h5>${model.name}</h5>
                    <p>${model.details || ""}</p>
                </div>
                <button class="select-model-btn" data-model-id="${model.id}">Chọn</button>
            `;
            itemDiv
                .querySelector(".select-model-btn")
                .addEventListener("click", () => selectComponentModel(model.id, componentType));
            modalItemList.appendChild(itemDiv);
        });
    }

    // --- SELECTION LOGIC ---
    function selectComponentModel(modelId, componentType) {
        selectedConfiguration[componentType] = modelId;
        closeModal();
        initializeComponentGrid(); // Re-render grid to show selection/update button text
        updateSelectedSummary(); // Ensure summary is updated after selection
    }

    function removeSelectedComponentModel(componentType) {
        if (selectedConfiguration[componentType]) {
            delete selectedConfiguration[componentType];
            initializeComponentGrid(); // Re-render to update buttons and selected text
            updateSelectedSummary(); // Update the summary view
        }
    }

    // --- COMPATIBILITY LOGIC ---
    function getAvailableModels(componentType) {
        const allModels = componentsData[componentType].models;
        let compatibleModels = allModels;

        // Filter based on already selected components
        Object.keys(selectedConfiguration).forEach((selectedCompType) => {
            if (selectedCompType === componentType) return; // Don't filter against itself

            const selectedModelId = selectedConfiguration[selectedCompType];
            if (!selectedModelId) return;

            const selectedComponentModel = componentsData[selectedCompType].models.find(
                (m) => m.id === selectedModelId
            );

            // Check if the current componentType needs to be compatible with selectedCompType
            // e.g., if RAM is selected, CPU models should be compatible with that RAM
            if (selectedComponentModel?.compatibleWith?.[componentType]) {
                compatibleModels = compatibleModels.filter((model) =>
                    selectedComponentModel.compatibleWith[componentType].includes(model.id)
                );
            }

            // Check if models of the current componentType have compatibility defined for selectedCompType
            // e.g., if CPU is selected, RAM models should list that CPU as compatible
            compatibleModels = compatibleModels.filter((model) => {
                if (model?.compatibleWith?.[selectedCompType]) {
                    return model.compatibleWith[selectedCompType].includes(selectedModelId);
                }
                return true; // If no specific compatibility is defined for this direction, assume compatible
            });
        });

        return compatibleModels;
    }

    // --- SUMMARY DISPLAY ---
    function updateSelectedSummary() {
        if (Object.keys(selectedConfiguration).length === 0) {
            selectedComponentsSummary.innerHTML = "<h3>Cấu hình đã chọn:</h3><p>Chưa có linh kiện nào được chọn.</p>";
            return;
        }

        let summaryHTML = "<h3>Cấu hình đã chọn:</h3><ul>";
        for (const compType in selectedConfiguration) {
            const modelId = selectedConfiguration[compType];
            const component = componentsData[compType];
            const model = component.models.find((m) => m.id === modelId);
            if (model) {
                summaryHTML += `<li><strong>${component.name}:</strong> ${model.name}</li>`;
            }
        }
        summaryHTML += "</ul>";
        selectedComponentsSummary.innerHTML = summaryHTML;
    }

    // --- EVENT LISTENERS ---
    closeModalButton.addEventListener("click", closeModal);
    window.addEventListener("click", (event) => {
        // Close modal if clicked outside
        if (event.target === componentModal) {
            closeModal();
        }
    });

    // --- STARTUP ---
    initializeComponentGrid();
});
