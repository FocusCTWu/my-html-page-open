/**
 * app.js - 2026 高安全性臨床公衛量能盤點表核心邏輯驅動
 * 完全隔離 DOM-based XSS，實作客製化欄位提示語與嚴格排他警告機制
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 因地制宜的 9 大基礎定位核心設定陣列
    const configMatrix = {
        'matrix-1a': {
            title: '1a. 物質使用障礙-篩檢評估',
            labelB: '篩檢次數',
            labelC: '每次施測時間 (分鐘)',
            hint: '請填寫使用的核心篩檢工具（如 AUDIT, DAST 等）或生化檢驗於「流程名稱」。',
            types: ['門診', '外展', '住院inpatient', '其他'],
            hasDuration: false
        },
        'matrix-1b': {
            title: '1b. 心理健康共病-篩檢評估',
            labelB: '每位個案篩檢次數',
            labelC: '每位個案評估時間 (分鐘)',
            hint: '請填寫使用的焦慮/憂鬱/精神症狀篩檢工具於「流程名稱」。',
            types: ['門診', '外展', '住院inpatient', '其他'],
            hasDuration: false
        },
        'matrix-1c': {
            title: '1c. 生理健康共病-篩檢評估',
            labelB: '每位個案篩檢次數',
            labelC: '每位個案評估時間 (分鐘)',
            hint: '請填寫使用的生化/影像/評估檢查工具於「流程名稱」。',
            types: ['門診', '外展', '住院inpatient', '其他'],
            hasDuration: false
        },
        'matrix-2a': {
            title: '2a. 物質使用障礙-短期介入/衛教',
            labelB: '整個療程預計介入次數',
            labelC: '每次介入時間 (分鐘)',
            hint: '請填寫使用的此短期介入/衛教名稱於「流程名稱」；並補充核心理論基礎（如動機式晤談法、危害控制觀點）於「說明」。',
            types: ['個別', '團體', '其他'],
            hasDuration: true,
            durationText: '物質使用障礙-短期介入/衛教 個案總期程：'
        },
        'matrix-2b': {
            title: '2b. 心理健康共病-衛教',
            labelB: '整個療程預計介入次數',
            labelC: '每次介入時間 (分鐘)',
            hint: '請填寫使用的此短期介入/衛教名稱於「流程名稱」。',
            types: ['個別', '團體', '其他'],
            hasDuration: true,
            durationText: '心理健康共病-衛教 個案總期程：'
        },
        'matrix-2c': {
            title: '2c. 生理健康共病-衛教',
            labelB: '整個療程預計介入次數',
            labelC: '每次衛教時間 (分鐘)',
            hint: '請填寫使用的此短期介入/衛教名稱於「流程名稱」。',
            types: ['個別', '團體', '其他'],
            hasDuration: true,
            durationText: '2c. 生理健康共病-衛教 個案總期程：'
        },
        'matrix-3a': {
            title: '3a. 物質使用障礙-專業治療',
            labelB: '整個療程幾次',
            labelC: '一次多少時間 (分鐘)',
            hint: '請分項填寫對應之個案核心療程細項，欄位不敷使用時請於其他/說明欄補充。',
            types: ['全日住院', '居住照護', '門診醫療', '個別治療', '團體治療', '其他'],
            hospitalType: ['全日住院', '居住照護'],
            hasDuration: true,
            durationText: '物質使用障礙-專業治療 個案療程總長度：'
        },
        'matrix-3b': {
            title: '3b. 心理健康共病-專業治療',
            labelB: '整個療程預計治療次數',
            labelC: '每次治療時間 (分鐘)',
            hint: '請分項填寫對應之個案心理健康共病療程細項，欄位不敷使用時請於其他/說明欄補充。',
            types: ['全日住院', '居住照護', '門診醫療', '個別治療', '團體治療', '其他'],
            hospitalType: ['全日住院', '居住照護'],
            hasDuration: true,
            durationText: '心理健康共病-專業治療 個案療程總長度：'
        },
        'matrix-3c': {
            title: '3c. 生理健康共病-專業治療',
            hint: '請分項填寫對應之個案療程細項，並請於說明欄補充說明。',
            isSpecial3c: true, // 💡 加上特殊標記，讓 3c 走獨立的簡化表格欄位
            hideDurationHint: true // 💡 標記為隱藏提示
        },
    };

    const container = document.getElementById('dynamic-program-container');
    const placeholder = document.getElementById('dynamic-placeholder');

    // 2. 監聽矩陣勾選盒狀態
    document.querySelectorAll('.matrix-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.id;
            if (e.target.checked) {
                renderSection(id);
            } else {
                removeSection(id);
            }
            togglePlaceholder();
        });
    });

    function togglePlaceholder() {
        if (container.querySelectorAll('.dynamic-section').length > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'block';
        }
    }
    function autoResizeTextarea(textarea) {
        if (!textarea) return;

        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    function autoResizeInlineInput(input) {
        if (!input) return;

        const minCh = 12;
        const maxCh = 42;
        const valueLength = input.value ? input.value.length : minCh;
        const nextCh = Math.min(Math.max(valueLength + 2, minCh), maxCh);

        input.style.width = nextCh + 'ch';
    }

    function bindAutoResizeField(field) {
        if (!field || field.dataset.autoresizeBound === '1') return;

        field.dataset.autoresizeBound = '1';

        if (field.tagName === 'TEXTAREA') {
            autoResizeTextarea(field);
            field.addEventListener('input', function () {
                autoResizeTextarea(field);
            });
        }

        if (field.classList.contains('inline-input')) {
            autoResizeInlineInput(field);
            field.addEventListener('input', function () {
                autoResizeInlineInput(field);
            });
        }
    }

    function bindAutoResizeInScope(scope) {
        if (!scope) return;

        scope.querySelectorAll('textarea, .inline-input').forEach(function (field) {
            bindAutoResizeField(field);
        });
    }

    window.addEventListener('beforeprint', function () {

        document.querySelectorAll('textarea').forEach(function (field) {
            autoResizeTextarea(field);
        });

        document.querySelectorAll('.inline-input').forEach(function (field) {
            autoResizeInlineInput(field);
        });

    });
    // 🌟 2026 標準：定義 1a 到 3c 的嚴格法定排序順序
    const strictOrder = [
        'matrix-1a', 'matrix-1b', 'matrix-1c',
        'matrix-2a', 'matrix-2b', 'matrix-2c',
        'matrix-3a', 'matrix-3b', 'matrix-3c'
    ];

    // 3. 高安全性動態區塊渲染器（已升級：具備 1a~3c 精準排序插入控制）
    function renderSection(id) {
        if (document.getElementById(`section-block-${id}`)) return;
        const config = configMatrix[id];

        // --- (開始建立新區塊的 DOM 節點，維持 2026 安全標準) ---
        const sectionDiv = document.createElement('div');
        sectionDiv.id = `section-block-${id}`;
        // 為了方便排序時進行屬性識別，特別為節點加上 data-matrix-id 屬性
        sectionDiv.setAttribute('data-matrix-id', id);
        sectionDiv.className = 'dynamic-section bg-white p-5 rounded-lg border border-gray-300 shadow-sm relative no-break';

        // 區塊標題
        const headTitle = document.createElement('h3');
        headTitle.className = 'text-base font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-2';
        headTitle.textContent = config.title;
        sectionDiv.appendChild(headTitle);

        // 總長度/期程輸入列：依據 config.hasDuration 決定是否渲染（修正版：已補上數字輸入框組裝）
        if (config.hasDuration) {
            // 🌟 核心修正：使用 inline-flex 與 items-center 確保在同一行，flex-nowrap 阻止斷行
            const durationDiv = document.createElement('div');
            durationDiv.className = 'inline-flex flex-nowrap items-center gap-1.5 mb-4 text-sm bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100';

            // 1. 建立文字標籤 (加上 whitespace-nowrap 防斷行)
            const durationLabel = document.createElement('span');
            durationLabel.className = 'font-bold text-gray-700 whitespace-nowrap';
            durationLabel.textContent = config.durationText;
            durationDiv.appendChild(durationLabel);

            // 2. 建立數字輸入框 (調整為緊湊寬度 w-20)
            const durationInput = document.createElement('input');
            durationInput.type = 'number';
            durationInput.placeholder = '0';
            durationInput.className = 'inline-input w-20 border border-gray-300 rounded px-1.5 py-0.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white';
            durationInput.min = '0';
            durationDiv.appendChild(durationInput);

            // 3. 建立單位下拉選單 (調整為極緊湊寬度 w-16)
            const durationSelect = document.createElement('select');
            // 🌟 補上 inline-select 以便被全域 CSS 精准排除，防範寬度被撐開
            durationSelect.className = 'inline-select border border-gray-300 rounded px-1 py-0.5 text-sm bg-white font-medium w-16 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer';
            ['日', '週'].forEach(unit => {
                const opt = document.createElement('option');
                opt.value = unit;
                opt.textContent = unit;
                durationSelect.appendChild(opt);
            });
            durationDiv.appendChild(durationSelect);

            // 將精緻的行內區塊塞入主容器中
            sectionDiv.appendChild(durationDiv);
        } else {
            const screeningInfoDiv = document.createElement('div');

            // 💡 修正點：針對 3c 特殊區塊更換提示字句
            if (config.isSpecial3c) {
                screeningInfoDiv.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
                screeningInfoDiv.textContent = '💡 提示：本項屬「生理健康共病之專業處置」，請依據實務填寫療程名稱並於說明欄補充。';
            } else {
                // 原本 1a, 1b, 1c 的篩檢提示
                screeningInfoDiv.className = 'mb-4 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-100';
                screeningInfoDiv.textContent = '💡 提示：本項定位屬「篩檢與即時評估」性質，以隨門診/外展施測完成為主，故無須填寫整體療程總期程。';
            }

            sectionDiv.appendChild(screeningInfoDiv);
        }

        // 建立表格響應式包裝 (補強滿版與上下間距)
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'overflow-x-auto mt-4 w-full';

        const table = document.createElement('table');
        // 🌟 核心修正：加入 w-full 強制滿版，並利用 border-collapse 與明確的灰色外框
        table.className = 'w-full text-left border-collapse border border-gray-300 table-fixed text-sm';

        // 建立表頭
        const thead = document.createElement('thead');
        thead.className = 'bg-gray-100 border-b border-gray-300';
        const headerRow = document.createElement('tr');

        // 定義各欄位的標題與其專屬的 RWD 百分比寬度比例，徹底解決「太窄」的問題
        const columnConfigs = config.isSpecial3c ? [
            { text: '療程名稱', width: '25%' },
            { text: '說明', width: '69%' },
            { text: '操作', width: '6%' }
        ] : (
            ['matrix-1a', 'matrix-1b', 'matrix-1c'].includes(id)
                ? [
                    { text: '流程名稱', width: '24%' },
                    { text: '介入場域', width: '8%' },
                    { text: '評估方式', width: '10%' },
                    { text: `${config.labelB}`, width: '8%' },
                    { text: `${config.labelC}`, width: '8%' },
                    { text: '說明', width: '36%' },
                    { text: '操作', width: '6%' }
                ]
                : [
                    { text: '流程名稱', width: '25%' },
                    { text: '介入型態', width: '10%' },
                    { text: `${config.labelB}`, width: '10%' },
                    { text: `${config.labelC}`, width: '10%' },
                    { text: '說明', width: '39%' },
                    { text: '操作', width: '6%' }
                ]
        );

        columnConfigs.forEach(col => {
            const th = document.createElement('th');
            // 🌟 核心修正：th 補上 border-gray-300 確保外框線條清晰可見
            th.className = 'border border-gray-300 p-2.5 font-bold text-gray-700 text-xs tracking-wider';
            th.style.width = col.width; // 鎖定安全欄位比例
            th.textContent = col.text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 表格主體
        const tbody = document.createElement('tbody');
        tbody.id = `tbody-${id}`;
        // 為 tbody 加上背景色與基本邊框底色
        tbody.className = 'bg-white divider-y divider-gray-200';
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        sectionDiv.appendChild(tableWrapper);

        // 獨立警告提示旗標區
        const flagDiv = document.createElement('div');
        flagDiv.id = `flag-box-${id}`;
        flagDiv.className = 'mt-3 text-red-600 bg-red-50 border border-red-200 p-3 rounded text-xs font-bold hidden leading-relaxed shadow-sm';
        sectionDiv.appendChild(flagDiv);

        // 控制列 (按鈕與客製化提示)
        const actionRow = document.createElement('div');
        actionRow.className = 'mt-3 flex justify-between items-center';

        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一行';
        addRowBtn.addEventListener('click', () => createTableRow(id, config));
        actionRow.appendChild(addRowBtn);

        const hintSpan = document.createElement('span');
        hintSpan.className = 'text-xs text-gray-500 italic';
        hintSpan.textContent = config.hint;
        actionRow.appendChild(hintSpan);
        sectionDiv.appendChild(actionRow);

        // 初始化預設建立首列
        createTableRow(id, config);
        // --- (DOM 節點建構完畢，準備將其排序插入容器) ---


        // 🌟 核心控制邏輯：尋找正確的排序位置進行插入
        const currentSections = Array.from(container.querySelectorAll('.dynamic-section'));
        const targetIndex = strictOrder.indexOf(id);

        let insertBeforeTarget = null;

        // 掃描容器中現有的區塊，找到第一個排列順序在當前勾選項目之後的節點
        for (const existingSection of currentSections) {
            const existingId = existingSection.getAttribute('data-matrix-id');
            const existingIndex = strictOrder.indexOf(existingId);
            if (existingIndex > targetIndex) {
                insertBeforeTarget = existingSection;
                break;
            }
        }

        // 如果找到了應該排在後面的節點，就插入在它前面；如果沒找到，代表當前項目最大，直接追加至最末端
        if (insertBeforeTarget) {
            container.insertBefore(sectionDiv, insertBeforeTarget);
        } else {
            container.appendChild(sectionDiv);
        }
    }

    function removeSection(id) {
        const target = document.getElementById(`section-block-${id}`);
        if (target) target.remove();
    }

    // 4. 動態安全表格列生成與精準條件約束
    function createTableRow(id, config) {
        const tbody = document.getElementById(`tbody-${id}`);
        if (!tbody) return;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 transition-colors border-b border-gray-200';

        // 💡 修正點：確認 config 是否正確或從矩陣中重新撈取，確保 isSpecial3c 條件恆真
        const currentConfig = config || configMatrix[id];

        if (currentConfig && currentConfig.isSpecial3c) {
            // 欄位 1: 療程
            const tdName = document.createElement('td');
            tdName.className = 'border border-gray-200 p-2';

            const inputName = document.createElement('textarea');

            inputName.rows = 2;
            inputName.placeholder = '請輸入流程名稱';

            inputName.className =
                'w-full min-h-[48px] border border-gray-300 rounded px-2 py-1.5 text-xs leading-relaxed focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none';

            tdName.appendChild(inputName);
            tr.appendChild(tdName);

            // 欄位 2: 說明
            const tdD = document.createElement('td');
            tdD.className = 'border border-gray-200 p-2';
            const inputD = document.createElement('textarea');
            inputD.rows = 2;
            inputD.placeholder = '請輸入相關說明...';
            inputD.className = 'w-full min-h-[48px] resize-y border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none';
            tdD.appendChild(inputD);
            tr.appendChild(tdD);

            // 欄位 3: 刪除操作
            const tdAction = document.createElement('td');
            tdAction.className = 'border border-gray-200 p-2 text-center';
            const delBtn = document.createElement('button');
            delBtn.type = 'button';
            delBtn.className = 'text-red-500 hover:text-red-700 text-xs font-bold px-1 transition-colors';
            delBtn.textContent = '刪除';
            delBtn.addEventListener('click', () => {
                const rowCount = tbody.querySelectorAll('tr').length;
                if (rowCount > 1) {
                    tr.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            tdAction.appendChild(delBtn);
            tr.appendChild(tdAction);

            tbody.appendChild(tr);
            bindAutoResizeInScope(tr);
            return; // 💡 3c 的特殊渲染到此結束，直接 return 中斷後續的標準欄位邏輯
        }

        // --- 以下為原本其他標準區塊的邏輯 (完全保持不動) ---
        // 欄位 1: 流程名稱
        const tdName = document.createElement('td');
        tdName.className = 'border border-gray-200 p-2';
        const inputName = document.createElement('textarea');
        inputName.rows = 2;
        inputName.placeholder = '請自填名稱';
        inputName.dataset.field = 'process_name';
        inputName.className = 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none';
        tdName.appendChild(inputName);
        tr.appendChild(tdName);

        // 欄位 2: A 介入型態下拉選單
        const tdType = document.createElement('td');
        tdType.className = 'border border-gray-200 p-2';
        const selectType = document.createElement('select');
        selectType.className = 'w-full border border-gray-300 rounded px-1 py-1.5 text-xs bg-white field-intervention-type focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer';
        selectType.dataset.field = 'intervention_setting';
        currentConfig.types.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t;
            opt.textContent = t;
            selectType.appendChild(opt);
        });
        tdType.appendChild(selectType);
        tr.appendChild(tdType);

        // 1a~1c 專用：評估方式
        if (['matrix-1a', 'matrix-1b', 'matrix-1c'].includes(id)) {

            const tdAssessment = document.createElement('td');
            tdAssessment.className = 'border border-gray-200 p-2';

            const selectAssessment = document.createElement('select');
            selectAssessment.className =
                'w-full border border-gray-300 rounded px-1 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer';
            selectAssessment.dataset.field = 'assessment_method';
            [
                '自填問卷',
                '會談',
                '收集檢體',
                '儀器施測',
                '其他'
            ].forEach(item => {
                const opt = document.createElement('option');
                opt.value = item;
                opt.textContent = item;
                selectAssessment.appendChild(opt);
            });

            tdAssessment.appendChild(selectAssessment);
            tr.appendChild(tdAssessment);
        }

        // 欄位 3: B 次數
        const tdB = document.createElement('td');
        tdB.className = 'border border-gray-200 p-2';
        const inputB = document.createElement('input');
        inputB.type = 'text';
        inputB.placeholder = '請填寫次數';
        inputB.className = 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-center field-count-b focus:ring-1 focus:ring-blue-500 focus:outline-none';
        inputB.dataset.field = 'session_count';
        tdB.appendChild(inputB);
        tr.appendChild(tdB);

        // 欄位 4: C 時間
        const tdC = document.createElement('td');
        tdC.className = 'border border-gray-200 p-2';
        const inputC = document.createElement('input');
        inputC.type = 'text';
        inputC.placeholder = '分鐘數';
        inputC.className = 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-center field-time-c focus:ring-1 focus:ring-blue-500 focus:outline-none';
        inputC.dataset.field = 'minutes_per_session';
        tdC.appendChild(inputC);
        tr.appendChild(tdC);

        // 欄位 5: D 說明
        const tdD = document.createElement('td');
        tdD.className = 'border border-gray-200 p-2';
        const inputD = document.createElement('textarea');
        inputD.rows = 2;
        inputD.placeholder = '其他補充描述';
        inputD.className = 'w-full min-h-[48px] resize-y border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none';
        inputD.dataset.field = 'note';
        tdD.appendChild(inputD);
        tr.appendChild(tdD);

        // 欄位 6: 刪除操作
        const tdAction = document.createElement('td');
        tdAction.className = 'border border-gray-200 p-2 text-center';
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'text-red-500 hover:text-red-700 text-xs font-bold px-1 transition-colors';
        delBtn.textContent = '刪除';
        delBtn.addEventListener('click', () => {
            const rowCount = tbody.querySelectorAll('tr').length;
            if (rowCount > 1) {
                tr.remove();
                evaluateBlockConstraints(id, currentConfig);
            } else {
                alert('方案規劃必須至少保留一項流程。');
            }
        });
        tdAction.appendChild(delBtn);
        tr.appendChild(tdAction);

        // 監聽選單變更，即時重算住院與排他性標記
        selectType.addEventListener('change', () => {
            if (currentConfig.hospitalType && currentConfig.hospitalType.includes(selectType.value)) {
                inputB.value = 'N/A';
                inputB.disabled = true;
                inputB.classList.add('bg-gray-100', 'text-gray-400');
                inputC.value = 'N/A';
                inputC.disabled = true;
                inputC.classList.add('bg-gray-100', 'text-gray-400');
            } else {
                if (inputB.value === 'N/A') inputB.value = '';
                inputB.disabled = false;
                inputB.classList.remove('bg-gray-100', 'text-gray-400');
                if (inputC.value === 'N/A') inputC.value = '';
                inputC.disabled = false;
                inputC.classList.remove('bg-gray-100', 'text-gray-400');
            }
            evaluateBlockConstraints(id, currentConfig);
        });

        tbody.appendChild(tr);
        bindAutoResizeInScope(tr);
        evaluateBlockConstraints(id, currentConfig);
    }

    // 5. 精準高度排他性評估機制 (與 Flag 自動撤銷消除邏輯)
    // 5. 精準高度排他性評估機制 (與 Flag 自動撤銷消除邏輯)
    function evaluateBlockConstraints(blockId, config) {
        // 💡 修正點：如果是 3c 等特殊簡化表格，不具備介入型態選項，直接安全回傳防止報錯
        const currentConfig = config || configMatrix[blockId];
        if (currentConfig && currentConfig.isSpecial3c) return;

        const tbody = document.getElementById(`tbody-${blockId}`);
        const flagBox = document.getElementById(`flag-box-${blockId}`);
        if (!tbody || !flagBox) return;

        // 收集目前表格區塊中，所有被選取的「介入型態」值
        const currentSelections = Array.from(tbody.querySelectorAll('.field-intervention-type')).map(select => select.value);

        // 判斷目前選中的項目中，有沒有「任何一個」屬於限制陣列中的項目
        const hasHospital = currentSelections.some(val =>
            currentConfig.hospitalType && (Array.isArray(currentConfig.hospitalType)
                ? currentConfig.hospitalType.includes(val)
                : val === currentConfig.hospitalType)
        );

        // 判斷目前選中的項目中，有沒有包含「非限制陣列」（即一般社區/門診）的項目
        const hasOthers = currentSelections.some(val =>
            currentConfig.hospitalType && (Array.isArray(currentConfig.hospitalType)
                ? !currentConfig.hospitalType.includes(val)
                : val !== currentConfig.hospitalType)
        );

        // 當「同時有高強度限制項目」且「又有一般項目」時，才觸發旗標
        if (hasHospital && hasOthers) {
            const typeNames = Array.isArray(currentConfig.hospitalType) ? currentConfig.hospitalType.join('或') : currentConfig.hospitalType;

            flagBox.textContent = `⚠️ 提示標記 (Flag)：本規劃區塊內同時配置了「${typeNames}」與社區/門診常規臨床處置。請確認此處是否為個案跨階段之「轉銜流程」（請在說明欄位中簡述），或為重複多重填報。`;
            flagBox.classList.remove('hidden');
        } else {
            // 不滿足混合條件時，立即隱藏
            flagBox.classList.add('hidden');
            flagBox.textContent = '';
        }
    }
    /* ==================== SECTION 5 START: Outcome Monitoring & MBC Infrastructure ==================== */

    (function () {
        function runWhenReady(callback) {
            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", callback);
            } else {
                callback();
            }
        }

        function createOption(value, text) {
            var option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            return option;
        }

        function createOptgroup(labelText, options) {
            var group = document.createElement("optgroup");
            group.label = labelText;

            options.forEach(function (item) {
                group.appendChild(createOption(item.value, item.text));
            });

            return group;
        }

        function createCheckbox(name, value, text) {
            var label = document.createElement("label");
            label.className = "flex items-center gap-2";

            var input = document.createElement("input");
            input.type = "checkbox";
            input.name = name;
            input.value = value;
            input.className = "mr-2";

            label.appendChild(input);
            label.appendChild(document.createTextNode(text));

            return label;
        }

        /* ===== 修正起始：SECTION 5 複選下拉選單其他文字同步顯示 ===== */

        function createMultiSelectDropdown(name, placeholder, options) {
            var details = document.createElement("details");
            details.className = "section5-multiselect";

            var summary = document.createElement("summary");
            summary.textContent = placeholder;
            details.appendChild(summary);

            var panel = document.createElement("div");
            panel.className = "section5-dropdown-panel grid grid-cols-1 md:grid-cols-2 gap-1";

            function updateSummary() {
                var selected = [];

                panel.querySelectorAll("input[type='checkbox']:checked").forEach(function (input) {
                    if (input.value === "other") {
                        var otherInput = panel.querySelector("input[name='" + name + "_other']");
                        var otherText = otherInput ? otherInput.value.trim() : "";

                        if (otherText) {
                            selected.push("其他：" + otherText);
                        } else {
                            selected.push("其他");
                        }
                    } else {
                        selected.push(input.getAttribute("data-label"));
                    }
                });

                if (selected.length === 0) {
                    summary.textContent = placeholder;
                } else {
                    summary.textContent = selected.join("、");
                }
            }

            options.forEach(function (item) {
                var label = document.createElement("label");

                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = name;
                checkbox.value = item.value;
                checkbox.setAttribute("data-label", item.text);

                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(item.text));

                if (item.value === "other") {
                    var otherInput = document.createElement("input");
                    otherInput.type = "text";
                    otherInput.name = name + "_other";
                    otherInput.className = "inline-input ml-2";
                    otherInput.placeholder = "請說明";

                    otherInput.addEventListener("input", updateSummary);

                    label.appendChild(otherInput);
                }

                checkbox.addEventListener("change", function () {
                    updateSummary();

                    if (checkbox.value !== "other") {
                        details.open = false;
                    }
                });

                panel.appendChild(label);
            });

            details.appendChild(panel);
            return details;
        }

        function createOtherCheckbox(name, otherInputName) {
            var label = document.createElement("label");
            label.className = "flex items-center gap-2";

            var checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = name;
            checkbox.value = "other";
            checkbox.className = "mr-2";

            var input = document.createElement("input");
            input.type = "text";
            input.name = otherInputName;
            input.className = "inline-input ml-2";
            input.placeholder = "請說明";

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode("其他："));
            label.appendChild(input);

            return label;
        }

        function createFieldLabel(text) {
            var label = document.createElement("label");
            label.className = "block text-sm font-semibold text-gray-800 mb-1";
            label.textContent = text;
            return label;
        }

        function createCheckboxGrid(children) {
            var grid = document.createElement("div");
            grid.className = "section5-checkbox-grid";

            children.forEach(function (child) {
                grid.appendChild(child);
            });

            return grid;
        }

        function createTextInput(name, placeholder) {
            var input = document.createElement("input");

            input.type = "text";
            input.name = name;
            input.placeholder = placeholder;

            input.className =
                "w-full rounded-md border-gray-300 shadow-sm " +
                "focus:border-blue-500 focus:ring-blue-500 text-base";

            return input;
        }

        function createTextarea(name, placeholder) {
            var textarea = document.createElement("textarea");
            textarea.name = name;
            textarea.rows = 4;
            textarea.placeholder = placeholder;
            textarea.className = "block w-full min-h-[96px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base";
            return textarea;
        }

        function createSelectForScaleTool() {
            var select = document.createElement("select");
            select.name = "s5_scale_tool";
            select.className = "w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base";

            select.appendChild(createOption("", "-- 請選擇量表型工具 --"));

            select.appendChild(createOptgroup("核心成癮成效與戒癮動機", [
                { value: "bam_t", text: "BAM-T：台灣版簡要成癮監測表" },
                { value: "cgi", text: "CGI-S / CGI-I：臨床整體印象量表" },
                { value: "urica", text: "URICA：改變動機量表" },
                { value: "vas_craving", text: "VAS for Craving：渴求視覺類比量表" },
                { value: "acq_brief", text: "ACQ-Brief：安非他命渴求問卷簡版" },
                { value: "sows", text: "SOWS：主觀鴉片類戒斷量表" },
                { value: "cows", text: "COWS：臨床鴉片類戒斷量表" },
                { value: "ciwa_ar", text: "CIWA-Ar：酒精戒斷評估量表" }
            ]));

            select.appendChild(createOptgroup("物質使用、診斷與風險篩檢", [
                { value: "dsm5_sud", text: "DSM-5 物質使用障礙診斷與嚴重度標準" },
                { value: "dast10", text: "DAST-10：藥物濫用篩檢量表" },
                { value: "audit", text: "AUDIT / AUDIT-C：酒精使用疾患篩檢量表" },
                { value: "ftnd", text: "FTND：尼古丁依賴評估量表" },
                { value: "cage", text: "CAGE：酒精成癮篩檢量表" },
                { value: "assist", text: "ASSIST：酒精、菸草和物質參與篩檢作業" }
            ]));

            select.appendChild(createOptgroup("精神症狀與心理健康", [
                { value: "bsrs5", text: "BSRS-5：簡式健康量表" },
                { value: "phq9", text: "PHQ-9 / PHQ-2：憂鬱篩檢" },
                { value: "gad7", text: "GAD-7：焦慮量表" },
                { value: "mini", text: "MINI：簡式國際精神醫學診斷會談" },
                { value: "bdi2", text: "BDI-II：貝克憂鬱量表第二版" },
                { value: "bai", text: "BAI：貝克焦慮量表" },
                { value: "stai", text: "STAI：狀態-特質焦慮量表" },
                { value: "panss", text: "PANSS：正負向症狀量表" },
                { value: "des", text: "DES：解離經驗量表" },
                { value: "pcl5", text: "PCL-5：創傷後壓力症候群檢核表" }
            ]));

            select.appendChild(createOptgroup("社會支持、家庭功能與生活品質", [
                { value: "whoqol_bref", text: "WHOQOL-BREF：生活品質問卷" },
                { value: "sofas", text: "SOFAS：社會與功能執行能力評估" },
                { value: "mos_ss", text: "MOS-SS：社會支持量表" },
                { value: "apgar", text: "APGAR：家庭功能量表" },
            ]));

            select.appendChild(createOptgroup("認知、神經心理與生活功能", [
                { value: "moca", text: "MoCA：蒙特利爾認知評估" },
                { value: "mmse", text: "MMSE：簡易精神狀態檢查" },
                { value: "barthel", text: "BI / Barthel Index：巴氏量表" }
            ]));

            select.appendChild(createOptgroup("其他特定行為、風險與介入評估流程", [
                { value: "other", text: "其他/自編量表或評估工具/流程" }
            ]));

            return select;
        }

        function createSelectForObjectiveMonitor() {
            var select = document.createElement("select");

            select.name = "s5_objective_monitor";

            select.className =
                "w-full rounded-md border-gray-300 shadow-sm " +
                "focus:border-emerald-500 focus:ring-emerald-500 text-base";

            select.appendChild(createOption(
                "",
                "-- 請選擇醫療檢驗或評估類型 --"
            ));

            select.appendChild(createOptgroup("成癮物質檢測", [
                { value: "addiction_substance_testing", text: "成癮物質檢測" }
            ]));

            select.appendChild(createOptgroup("其他共病醫療檢測", [
                { value: "infection_risk", text: "感染風險檢測（如 HIV / HCV / HBV / STI）" },
                { value: "liver_renal_function", text: "肝腎功能檢測" },
                { value: "medication_safety", text: "用藥安全監測（如 ECG / 血中濃度）" },
                { value: "pregnancy_reproductive", text: "懷孕或生殖健康相關檢測" },
                { value: "general_physical_status", text: "一般生理狀態監測（如生命徵象）" },
                { value: "imaging_or_other", text: "影像學醫療檢查" },
                { value: "other", text: "其他共病醫療檢測" }
            ]));

            return select;
        }

        function createFrequencyGrid(name) {
            return createMultiSelectDropdown(name, "請選擇使用頻率（可複選）", [
                { value: "intake", text: "初評" },
                { value: "each_visit", text: "每次回診" },
                { value: "weekly", text: "每週" },
                { value: "monthly", text: "每月" },
                { value: "discharge", text: "結案時" },
                { value: "other", text: "其他" }
            ]);
        }

        function createUseCaseGrid(name) {
            return createMultiSelectDropdown(name, "請選擇主要用途（可複選）", [
                { value: "intake_assessment", text: "收案評估 / 初評" },
                { value: "clinical_care", text: "臨床治療追蹤" },
                { value: "risk_monitoring", text: "高風險監測" },
                { value: "research_analysis", text: "研究分析" },
                { value: "other", text: "其他" }
            ]);
        }

        function createIntegrationGrid(name) {
            return createMultiSelectDropdown(name, "請選擇資料管理與系統化方式（可複選）", [
                { value: "paper_excel", text: "紙本或 Excel 為主" },
                { value: "hospital_system", text: "院內資訊系統（如 HIS / 個管系統）" },
                { value: "independent_database", text: "獨立資料庫或研究系統" },
                { value: "substance_medical_management_system", text: "藥酒癮個管系統" },
                { value: "other", text: "其他" }
            ]);
        }

        function createSection5Card(cardType) {
            var card = document.createElement("div");
            card.className = "section5-card";

            var header = document.createElement("div");
            header.className = "section5-card-header";

            var title = document.createElement("h4");
            title.className = "section5-card-title";
            title.textContent = cardType === "scale" ? "量表型工具" : "醫療檢測評估項目";

            var removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium py-1 px-3 rounded text-xs";
            removeButton.textContent = "刪除";

            header.appendChild(title);
            header.appendChild(removeButton);
            card.appendChild(header);

            /* ===== 修正起始：SECTION 5 其他工具名稱條件顯示 ===== */

            /* ===== 修正起始：SECTION 5 工具選其他才顯示補充名稱，改選則收回 ===== */

            var toolWrapper = document.createElement("div");
            toolWrapper.className = "section5-field";

            toolWrapper.appendChild(createFieldLabel(
                cardType === "scale" ? "評估工具" : "監測項目"
            ));

            var toolSelect = cardType === "scale"
                ? createSelectForScaleTool()
                : createSelectForObjectiveMonitor();

            toolWrapper.appendChild(toolSelect);
            card.appendChild(toolWrapper);

            var otherWrapper = document.createElement("div");
            otherWrapper.className = "section5-field";
            otherWrapper.style.display = "none";

            otherWrapper.appendChild(createFieldLabel("若選擇其他，請補充名稱"));

            var otherNameInput = createTextInput(
                cardType === "scale" ? "s5_scale_tool_other_name" : "s5_objective_monitor_other_name",
                "請填寫其他工具或監測項目名稱"
            );

            otherWrapper.appendChild(otherNameInput);
            card.appendChild(otherWrapper);

            /* ===== 修正起始：SECTION 5 成癮物質檢測細項 ===== */

            var substanceTestingWrapper = document.createElement("div");

            substanceTestingWrapper.className = "section5-field";
            substanceTestingWrapper.style.display = "none";

            /* 測什麼 */

            substanceTestingWrapper.appendChild(
                createFieldLabel("檢測物質")
            );

            var substanceTargetSelect = document.createElement("select");

            substanceTargetSelect.name = "s5_substance_testing_target";

            substanceTargetSelect.className =
                "w-full rounded-md border-gray-300 shadow-sm " +
                "focus:border-emerald-500 focus:ring-emerald-500 text-base";

            substanceTargetSelect.appendChild(
                createOption("", "-- 請選擇檢測物質 --")
            );

            [
                { value: "opioids", text: "鴉片類 / Opioids" },
                { value: "methamphetamine", text: "安非他命 / 甲基安非他命" },
                { value: "ketamine", text: "K他命" },
                { value: "cannabis", text: "大麻類" },
                { value: "benzodiazepines", text: "BZD / 鎮靜安眠藥" },
                { value: "alcohol", text: "酒精" },
                { value: "nicotine", text: "尼古丁 / Cotinine" },
                { value: "multiple_panel", text: "多合一 panel" },
                { value: "other", text: "其他" }
            ].forEach(function (item) {
                substanceTargetSelect.appendChild(
                    createOption(item.value, item.text)
                );
            });

            substanceTestingWrapper.appendChild(substanceTargetSelect);

            /* 怎麼測 */

            substanceTestingWrapper.appendChild(
                createFieldLabel("檢測方式（可複選）")
            );

            substanceTestingWrapper.appendChild(
                createMultiSelectDropdown(
                    "s5_substance_testing_method",
                    "請選擇檢測方式（可複選）",
                    [
                        { value: "rapid_test", text: "快篩" },
                        { value: "lab_immunoassay", text: "實驗室免疫分析" },
                        { value: "confirmatory_ms", text: "確認檢驗（如 GC/MS、LC/MS）" },
                        { value: "other", text: "其他" }
                    ]
                )
            );

            /* 在哪測 / 什麼樣本 */

            substanceTestingWrapper.appendChild(
                createFieldLabel("樣本（可複選）")
            );

            substanceTestingWrapper.appendChild(
                createMultiSelectDropdown(
                    "s5_substance_testing_sample",
                    "請選擇樣本（可複選）",
                    [
                        { value: "urine", text: "尿液" },
                        { value: "blood", text: "血液" },
                        { value: "saliva", text: "唾液" },
                        { value: "breath", text: "呼氣" },
                        { value: "hair", text: "毛髮" },
                        { value: "other", text: "其他" }
                    ]
                )
            );

            card.appendChild(substanceTestingWrapper);
            /* ===== 修正起始：SECTION 5 共病醫療檢測細項 ===== */

            var medicalTestingWrapper = document.createElement("div");

            medicalTestingWrapper.className = "section5-field";
            medicalTestingWrapper.style.display = "none";

            /* 檢測標的 */

            medicalTestingWrapper.appendChild(
                createFieldLabel("檢測標的")
            );

            medicalTestingWrapper.appendChild(
                createTextInput(
                    "s5_medical_testing_target",
                    "例如：HIV、HCV RNA、AST/ALT、QTc、懷孕檢測"
                )
            );

            /* 檢測方式 / 樣本 */

            medicalTestingWrapper.appendChild(
                createFieldLabel("檢測方式 / 樣本")
            );

            medicalTestingWrapper.appendChild(
                createTextInput(
                    "s5_medical_testing_method",
                    "例如：抽血、ECG、影像、尿液、外送檢驗"
                )
            );

            card.appendChild(medicalTestingWrapper);

            /* ===== 修正結束：SECTION 5 共病醫療檢測細項 ===== */
            /* ===== 修正結束：SECTION 5 成癮物質檢測細項 ===== */

            toolSelect.addEventListener("change", function () {

                /* 其他名稱欄位 */

                if (toolSelect.value === "other") {
                    otherWrapper.style.display = "block";
                } else {
                    otherWrapper.style.display = "none";
                    otherNameInput.value = "";
                }

                /* 成癮物質檢測細項 */

                if (
                    cardType === "objective" &&
                    toolSelect.value === "addiction_substance_testing"
                ) {
                    substanceTestingWrapper.style.display = "block";
                } else if (cardType === "objective") {
                    substanceTestingWrapper.style.display = "none";
                }
                /* 共病醫療檢測細項 */

                var medicalTestingValues = [
                    "infection_risk",
                    "liver_renal_function",
                    "medication_safety",
                    "pregnancy_reproductive",
                    "general_physical_status",
                    "imaging_or_other",
                    "other"
                ];

                if (
                    cardType === "objective" &&
                    medicalTestingValues.includes(toolSelect.value)
                ) {
                    medicalTestingWrapper.style.display = "block";
                } else if (cardType === "objective") {
                    medicalTestingWrapper.style.display = "none";
                }

            });

            /* ===== 修正結束：SECTION 5 工具選其他才顯示補充名稱，改選則收回 ===== */
            /* ===== 修正結束：SECTION 5 其他工具名稱條件顯示 ===== */

            var frequencyWrapper = document.createElement("div");
            frequencyWrapper.className = "section5-field";
            frequencyWrapper.appendChild(createFieldLabel("使用頻率（可複選）"));
            frequencyWrapper.appendChild(createFrequencyGrid(
                cardType === "scale" ? "s5_scale_frequency" : "s5_objective_frequency"
            ));
            card.appendChild(frequencyWrapper);

            var useCaseWrapper = document.createElement("div");
            useCaseWrapper.className = "section5-field";
            useCaseWrapper.appendChild(createFieldLabel("主要用途（可複選）"));
            useCaseWrapper.appendChild(createUseCaseGrid(
                cardType === "scale" ? "s5_scale_use_case" : "s5_objective_use_case"
            ));
            card.appendChild(useCaseWrapper);

            var integrationWrapper = document.createElement("div");
            integrationWrapper.className = "section5-field";
            integrationWrapper.appendChild(createFieldLabel("資料管理與系統整合程度（可複選）"));
            integrationWrapper.appendChild(createIntegrationGrid(
                cardType === "scale" ? "s5_scale_integration" : "s5_objective_integration"
            ));
            card.appendChild(integrationWrapper);

            var noteWrapper = document.createElement("div");
            noteWrapper.className = "section5-field";
            noteWrapper.appendChild(createFieldLabel("補充說明（選填）"));
            noteWrapper.appendChild(createTextarea(
                cardType === "scale" ? "s5_scale_note" : "s5_objective_note",
                cardType === "scale"
                    ? "例如：特定族群才使用、目前施測困難、授權限制、填寫負擔、語言版本或人員訓練需求。"
                    : "例如：特定族群才檢查、檢驗成本限制、檢驗可近性、等待時間、轉介流程或結果回收困難。"
            ));
            card.appendChild(noteWrapper);

            removeButton.addEventListener("click", function () {
                var parent = card.parentElement;
                if (!parent) {
                    return;
                }

                if (parent.children.length > 1) {
                    parent.removeChild(card);
                }
            });
            bindAutoResizeInScope(card);
            return card;
        }

        runWhenReady(function () {
            var scaleContainer = document.getElementById("section5-scale-tool-container");
            var objectiveContainer = document.getElementById("section5-objective-monitor-container");
            var addScaleButton = document.getElementById("add-section5-scale-tool-btn");
            var addObjectiveButton = document.getElementById("add-section5-objective-monitor-btn");

            if (scaleContainer && addScaleButton) {
                scaleContainer.appendChild(createSection5Card("scale"));

                addScaleButton.addEventListener("click", function () {
                    scaleContainer.appendChild(createSection5Card("scale"));
                });
            }

            if (objectiveContainer && addObjectiveButton) {
                objectiveContainer.appendChild(createSection5Card("objective"));

                addObjectiveButton.addEventListener("click", function () {
                    objectiveContainer.appendChild(createSection5Card("objective"));
                });
            }
        });
    })();

    /* ==================== SECTION 5 END: Outcome Monitoring & MBC Infrastructure ==================== */

    // ===== 追加起始：第六區塊 6A 動態新增列，不變更資安設定 =====

    const staffRoleOptions = [
        '精神科/成癮科醫師',
        '其他專科醫師',
        '護理師',
        '臨床心理師',
        '諮商心理師',
        '社會工作師',
        '職能治療師',
        '公共衛生師',
        '個案管理員',
        '研究員',
        '助理',
        '待聘',
        '其他'
    ];

    function createSelect(options, className) {
        const select = document.createElement('select');
        select.className = className;

        options.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            select.appendChild(option);
        });

        return select;
    }

    function createInput(type, placeholder, className) {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.className = className;
        if (type === 'number') input.min = '0';
        return input;
    }

    function createAutoTextarea(placeholder, className) {
        const textarea = document.createElement('textarea');
        textarea.rows = 2;
        textarea.placeholder = placeholder;
        textarea.className = className + ' auto-textarea';
        return textarea;
    }

    function createDeleteButton(tbody, tr) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = '刪除';
        btn.className = 'text-red-500 hover:text-red-700 text-xs font-bold px-1';

        btn.addEventListener('click', () => {
            const rowCount = tbody.querySelectorAll('tr').length;
            if (rowCount > 1) {
                tr.remove();
            } else {
                alert('此分類至少需保留一筆資料列。');
            }
        });

        return btn;
    }

    function appendFundedStaffRow() {
        const tbody = document.getElementById('tbody-funded-staff');
        if (!tbody) return;

        const tr = document.createElement('tr');

        const tdFunding = document.createElement('td');
        tdFunding.appendChild(createSelect(
            ['計畫主持人', '共同主持人', '專任'],
            'w-full text-center'
        ));

        const tdRole = document.createElement('td');
        tdRole.appendChild(createSelect(staffRoleOptions, 'w-full text-center'));

        const tdSeniority = document.createElement('td');
        tdSeniority.appendChild(createInput(
            'number',
            '年資 (年)',
            'w-full text-center'
        ));

        const tdWork = document.createElement('td');
        tdWork.appendChild(createAutoTextarea(
            '如：評估、治療、個管、衛教',
            'w-full text-left border-none resize-none'
        ));

        const tdRequirement = document.createElement('td');
        tdRequirement.appendChild(createAutoTextarea(
            '如：成癮訓練、MI、CBT、年資',
            'w-full text-left border-none resize-none'
        ));

        const tdAction = document.createElement('td');
        tdAction.className = 'text-center';
        tdAction.appendChild(createDeleteButton(tbody, tr));

        tr.appendChild(tdFunding);
        tr.appendChild(tdRole);
        tr.appendChild(tdSeniority);
        tr.appendChild(tdWork);
        tr.appendChild(tdRequirement);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
        bindAutoResizeInScope(tr);
    }

    function appendContractedStaffRow() {
        const tbody = document.getElementById('tbody-contracted-staff');
        if (!tbody) return;

        const tr = document.createElement('tr');

        const tdFeeType = document.createElement('td');
        tdFeeType.appendChild(createSelect(
            ['培訓督導相關', '服務提供相關', '研究相關'],
            'w-full text-center'
        ));

        const tdRole = document.createElement('td');
        tdRole.appendChild(createAutoTextarea(
            '請輸入職稱',
            'w-full text-left border-none resize-none'
        ));

        const tdFrequency = document.createElement('td');
        tdFrequency.appendChild(createAutoTextarea(
            '如：3a認知行為團體治療',
            'w-full text-left border-none resize-none'
        ));

        const tdPurpose = document.createElement('td');
        tdPurpose.appendChild(createAutoTextarea(
            '如：治療、督導、衛教',
            'w-full text-left border-none resize-none'
        ));

        const tdCost = document.createElement('td');
        tdCost.appendChild(createAutoTextarea(
            '如：1場2000元/2小時',
            'w-full text-left border-none resize-none'
        ));

        const tdAction = document.createElement('td');
        tdAction.className = 'text-center';
        tdAction.appendChild(createDeleteButton(tbody, tr));

        tr.appendChild(tdFeeType);
        tr.appendChild(tdRole);
        tr.appendChild(tdFrequency);
        tr.appendChild(tdPurpose);
        tr.appendChild(tdCost);
        tr.appendChild(tdAction);

        tbody.appendChild(tr);
        bindAutoResizeInScope(tr);
    }

    const addFundedBtn = document.getElementById('add-funded-staff-btn');
    const addContractedBtn = document.getElementById('add-contracted-staff-btn');

    if (addFundedBtn) addFundedBtn.addEventListener('click', appendFundedStaffRow);
    if (addContractedBtn) addContractedBtn.addEventListener('click', appendContractedStaffRow);

    appendFundedStaffRow();
    appendContractedStaffRow();

    // ===== 追加結束：第六區塊 6A 動態新增列，不變更資安設定 =====
    // ===== 修正起始：列印 / 匯出 PDF 按鈕，不變更資安設定 =====


    function getCleanText(text) {
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    function getOptionText(field) {
        const label = field.closest('label');
        if (!label) return '';

        const clone = label.cloneNode(true);
        clone.querySelectorAll('input, select, textarea').forEach(el => el.remove());

        return getCleanText(clone.textContent);
    }

    function getFieldValue(field) {
        if (!field) return '';

        if (field.type === 'checkbox') {
            return field.checked;
        }

        if (field.type === 'radio') {
            if (!field.checked) return null;

            if (field.value && field.value !== 'on') {
                return field.value;
            }

            return getOptionText(field);
        }

        return field.value || '';
    }

    function collectSection1Data() {
        const form = document.getElementById('inventoryForm');

        const textInputs = Array.from(form.querySelectorAll('input[type="text"]'));
        const numberInputs = Array.from(form.querySelectorAll('input[type="number"]'));

        const checkedLocation = form.querySelector('input[name="location"]:checked');
        const locationOtherInput = checkedLocation
            ? checkedLocation.closest('label')?.querySelector('input[type="text"]')
            : null;

        return {
            program_name: textInputs[0]?.value || '',
            operating_agency: textInputs[1]?.value || '',
            program_director_name: textInputs[2]?.value || '',
            program_director_title: textInputs[3]?.value || '',
            service_location: checkedLocation ? getFieldValue(checkedLocation) : '',
            service_location_other: locationOtherInput?.value || '',
            max_capacity: numberInputs[0]?.value || '',
            monthly_new_cases: numberInputs[1]?.value || ''
        };
    }

    function collectCheckedOptionsByLabel(sectionTitleText, questionIncludesText) {
        const sectionTitle = Array.from(document.querySelectorAll('.section-title'))
            .find(el => el.textContent.includes(sectionTitleText));

        if (!sectionTitle) return [];

        const fields = [];
        let node = sectionTitle.nextElementSibling;

        while (node && !node.classList.contains('section-title')) {
            node.querySelectorAll?.('input[type="checkbox"]').forEach(box => {
                const formRow = box.closest('.form-row');
                const rowLabel = formRow?.querySelector('label.block')?.textContent || '';

                if (rowLabel.includes(questionIncludesText) && box.checked) {
                    fields.push(getOptionText(box));
                }
            });

            node = node.nextElementSibling;
        }

        return fields;
    }

    function collectOtherTextByQuestion(sectionTitleText, questionIncludesText) {
        const sectionTitle = Array.from(document.querySelectorAll('.section-title'))
            .find(el => el.textContent.includes(sectionTitleText));

        if (!sectionTitle) return '';

        let node = sectionTitle.nextElementSibling;

        while (node && !node.classList.contains('section-title')) {
            const formRows = node.querySelectorAll?.('.form-row') || [];

            for (const row of formRows) {
                const rowLabel = row.querySelector('label.block')?.textContent || '';
                if (!rowLabel.includes(questionIncludesText)) continue;

                const otherInput = Array.from(row.querySelectorAll('input[type="text"]'))
                    .find(input => input.classList.contains('inline-input'));

                return otherInput?.value || '';
            }

            node = node.nextElementSibling;
        }

        return '';
    }

    function collectSection2Data() {
        return {
            recipients: collectCheckedOptionsByLabel('第二區塊', '適用對象'),
            recipients_other: collectOtherTextByQuestion('第二區塊', '適用對象'),

            target_age_groups: collectCheckedOptionsByLabel('第二區塊', '適用年齡層'),
            target_age_group_other: collectOtherTextByQuestion('第二區塊', '適用年齡層'),

            gender_groups: collectCheckedOptionsByLabel('第二區塊', '適用性別'),
            gender_group_other: collectOtherTextByQuestion('第二區塊', '適用性別'),

            primary_substances: collectCheckedOptionsByLabel('第二區塊', '主要成癮物質'),
            primary_substance_other: collectOtherTextByQuestion('第二區塊', '主要成癮物質'),

            co_occurring_special_populations: collectCheckedOptionsByLabel('第二區塊', '共病與特殊照護能力'),
            co_occurring_special_population_other: collectOtherTextByQuestion('第二區塊', '共病與特殊照護能力')
        };
    }

    function collectSection3Data() {
        return Array.from(document.querySelectorAll('.matrix-checkbox')).map(box => ({
            id: box.id,
            value: box.value,
            label: getCleanText(box.closest('label')?.textContent || ''),
            checked: box.checked
        }));
    }

    function collectSection4Data() {
        const result = [];

        document.querySelectorAll('.dynamic-section').forEach(section => {
            const matrixId = section.getAttribute('data-matrix-id');
            const title = section.querySelector('h3')?.textContent.trim() || '';

            const rows = [];

            section.querySelectorAll('tbody tr').forEach(tr => {
                const rowData = {};

                tr.querySelectorAll('input, select, textarea').forEach((field, index) => {
                    let key = field.dataset.field || field.name || '';

                    if (!key) {
                        if (index === 0) key = 'process_name';
                        else if (field.classList.contains('field-intervention-type')) key = 'intervention_setting';
                        else if (field.classList.contains('field-count-b')) key = 'session_count';
                        else if (field.classList.contains('field-time-c')) key = 'minutes_per_session';
                        else if (field.tagName === 'TEXTAREA') key = 'note';
                        else key = `field_${index + 1}`;
                    }

                    rowData[key] = field.value || '';
                });

                rows.push(rowData);
            });

            result.push({
                matrix_id: matrixId,
                title: title,
                rows: rows
            });
        });

        return result;
    }

    function collectSection5Data() {
        function collectCards(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return [];

            return Array.from(container.querySelectorAll('.section5-card')).map(card => {
                const cardData = {};

                card.querySelectorAll('input, select, textarea').forEach((field, index) => {
                    const key =
                        field.name ||
                        field.dataset.field ||
                        field.id ||
                        `field_${index + 1}`;

                    if (field.type === 'checkbox') {
                        if (!cardData[key]) cardData[key] = [];
                        if (field.checked) cardData[key].push(field.value || true);
                    } else {
                        cardData[key] = field.value || '';
                    }
                });

                return cardData;
            });
        }

        return {
            scale_tools: collectCards('section5-scale-tool-container'),
            objective_monitors: collectCards('section5-objective-monitor-container')
        };
    }

    function collectSection6Data() {
        function collectRows(tbodyId, keys) {
            const tbody = document.getElementById(tbodyId);
            if (!tbody) return [];

            return Array.from(tbody.querySelectorAll('tr')).map(tr => {
                const row = {};
                const fields = Array.from(tr.querySelectorAll('input, select, textarea'));

                keys.forEach((key, index) => {
                    row[key] = fields[index]?.value || '';
                });

                return row;
            });
        }

        return {
            funded_staff: collectRows('tbody-funded-staff', [
                'funding_type',
                'staff_role',
                'professional_seniority_years',
                'main_work_content',
                'background_or_requirement'
            ]),
            contracted_staff: collectRows('tbody-contracted-staff', [
                'fee_type',
                'role_title',
                'related_section4_process_name',
                'work_description',
                'cost_description'
            ])
        };
    }

    function collectSection7Data() {
        function valueOf(name) {
            return document.querySelector(`#section-7 [name="${name}"]`)?.value || '';
        }

        function checkedValues(name) {
            return Array.from(
                document.querySelectorAll(`#section-7 [name="${name}"]:checked`)
            ).map(input => input.value);
        }

        return {
            core_capabilities: [
                valueOf('s7_capability_1'),
                valueOf('s7_capability_2'),
                valueOf('s7_capability_3')
            ].filter(Boolean),

            capability_other:
                valueOf('s7_capability_other'),

            training_design: {
                components:
                    checkedValues('s7_training_components'),

                process_description:
                    valueOf('s7_training_design')
            },

            competency_verification: {
                methods:
                    checkedValues('s7_competency_check_methods'),

                standard:
                    valueOf('s7_competency_standard')
            },

            supervision_design: {
                formats:
                    checkedValues('s7_supervision_formats'),

                frequency:
                    valueOf('s7_supervision_frequency'),

                supervisor_source:
                    valueOf('s7_supervisor_source'),

                content:
                    valueOf('s7_supervision_content'),

                output:
                    valueOf('s7_supervision_output')
            },

            knowledge_transfer: {
                resources:
                    checkedValues('s7_knowledge_resources'),

                description:
                    valueOf('s7_knowledge_transfer_description')
            },

            transferable_practice: {
                name:
                    valueOf('s7_best_practice_name'),

                training:
                    valueOf('s7_best_practice_training'),

                supervision:
                    valueOf('s7_best_practice_supervision'),

                requirement:
                    valueOf('s7_best_practice_requirement')
            }
        };
    }

    function collectInventoryJson() {
        return {
            schema_version: 'asam_inventory_v2',
            exported_at: new Date().toISOString(),

            section1_program_basic_info: collectSection1Data(),
            section2_target_population: collectSection2Data(),
            section3_program_foundation_scope: collectSection3Data(),
            section4_program_service_planning: collectSection4Data(),
            section5_measurement_based_care: collectSection5Data(),
            section6_staffing_composition: collectSection6Data(),
            section7_workforce_sustainability: collectSection7Data()
        };
    }

    function downloadJsonFile(data, filename) {
        const jsonText = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonText], {
            type: 'application/json;charset=utf-8'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }

    const exportJsonBtn = document.getElementById('export-json-btn');

    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            const data = collectInventoryJson();
            downloadJsonFile(data, 'asam_inventory_export.json');
        });
    }
    const securePrintBtn = document.getElementById('secure-print-btn');

    if (securePrintBtn) {
        securePrintBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // ===== 修正結束：列印 / 匯出 PDF 按鈕，不變更資安設定 =====

    bindAutoResizeInScope(document);
});
