/**
 * app.js - 2026 高安全性臨床公衛量能盤點表核心邏輯驅動
 * 完全隔離 DOM-based XSS，實作客製化欄位提示語與嚴格排他警告機制
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. 因地制宜的核心設定陣列
    const configMatrix = {
        'matrix-1a': {
            kind: 'assessment',
            title: '1a. 物質使用障礙-篩檢',
            targetLabel: '執行標的',
            targetOptions: ['渴癮', '戒斷風險', '中毒/過量風險', '復發風險', '治療動機/改變準備度', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['自填問卷', '會談', '檢體檢驗', '儀器施測', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'assessment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-1b': {
            kind: 'assessment',
            title: '1b. 精神健康/共病-篩檢',
            targetLabel: '執行標的',
            targetOptions: ['情緒症狀', '焦慮', '精神病症狀', '自殺風險', '心理創傷', '睡眠障礙', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['自填問卷', '會談', '檢體檢驗', '儀器施測', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'assessment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-1c': {
            kind: 'assessment',
            title: '1c. 生理共病-篩檢',
            targetLabel: '執行標的',
            targetOptions: ['傳染病-肝炎', '傳染病-HIV', '傳染病-性病', '傳染病-肺結核', '傳染病-其他', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['自填問卷', '會談', '檢體檢驗', '儀器施測', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'assessment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-1d': {
            kind: 'assessment',
            title: '1d. 社會/職業功能及復元支持-評估',
            targetLabel: '執行標的',
            targetOptions: ['生活適應評估', '職業功能評估', '社會福利資源需求', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['自填問卷', '會談', '檢體檢驗', '儀器施測', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'assessment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-2a': {
            kind: 'brief',
            title: '2a. 物質使用障礙-短期介入/衛教/轉介',
            itemLabel: '服務項目',
            itemOptions: ['短期介入', '衛教', '轉介'],
            targetLabel: '執行標的',
            targetOptions: ['渴癮', '戒斷風險', '中毒/過量風險', '復發風險', '治療動機/改變準備度', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家屬', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'brief',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-2b': {
            kind: 'brief',
            title: '2b. 精神健康/共病-短期介入/衛教/轉介',
            itemLabel: '服務項目',
            itemOptions: ['短期介入', '衛教', '轉介'],
            targetLabel: '執行標的',
            targetOptions: ['情緒症狀', '焦慮', '精神病症狀', '自殺風險', '心理創傷', '睡眠障礙', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家屬', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'brief',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-2c': {
            kind: 'brief',
            title: '2c. 生理共病-短期介入/衛教/轉介',
            itemLabel: '服務項目',
            itemOptions: ['短期介入', '衛教', '轉介'],
            targetLabel: '執行標的',
            targetOptions: ['傳染病-肝炎', '傳染病-HIV', '傳染病-性病', '傳染病-肺結核', '傳染病-其他', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家屬', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'brief',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-2d': {
            kind: 'brief',
            title: '2d. 社會/職業功能及復元支持-短期介入/衛教/轉介',
            itemLabel: '服務項目',
            itemOptions: ['短期介入', '衛教', '轉介'],
            targetLabel: '執行標的',
            targetOptions: ['生活適應', '職業功能', '社會福利資源需求', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家屬', '其他'],
            settingOptions: ['住院-精神/成癮科', '住院-其他科', '門診-精神/成癮科', '門診-其他科', '急診', '社區-社福機構/診所', '社區-潛藏族群', '矯正機關', '其他'],
            doseType: 'brief',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-3a': {
            kind: 'treatment',
            title: '3a. 物質使用障礙-專業治療',
            targetLabel: '執行標的',
            targetOptions: ['渴癮', '戒斷風險', '中毒/過量風險', '復發風險', '治療動機/改變準備度', '其他'],
            itemLabel: '治療／處置／復健項目',
            itemOptions: ['藥物治療', '認知行為治療（CBT）', '動機增強治療（MET）', '動機式晤談（MI）', 'Matrix Model', '權變管理（CM）', '團體治療', '家庭治療', '復發預防', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家庭', '電話/LINE/視訊等遠距方式', '其他'],
            settingOptions: ['全日住院', '居住照護', '日間留院', '門診', '其他'],
            doseType: 'treatment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-3b': {
            kind: 'treatment',
            title: '3b. 精神健康/共病-專業治療',
            targetLabel: '執行標的',
            targetOptions: ['情緒症狀', '焦慮', '精神病症狀', '自殺風險', '心理創傷', '睡眠障礙', '其他'],
            itemLabel: '治療／處置／復健項目',
            itemOptions: ['精神科診療', '心理治療', '團體治療', '創傷治療', '睡眠介入', '自殺風險處遇', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家庭', '藥物管理', '電話/LINE/視訊等遠距方式', '其他'],
            settingOptions: ['全日住院', '居住照護', '日間留院', '門診', '其他'],
            doseType: 'treatment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-3c': {
            kind: 'treatment',
            title: '3c. 生理共病-專業治療',
            targetLabel: '執行標的',
            targetOptions: ['傳染病-肝炎', '傳染病-HIV', '傳染病-性病', '傳染病-肺結核', '傳染病-其他', '其他'],
            itemLabel: '治療／處置／復健項目',
            itemOptions: ['HIV/HCV/HBV 篩檢與轉介', '肝腎功能追蹤', '用藥安全監測', '感染科轉介', '肝膽腸胃科轉介', '內科共病轉介', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['醫療診察', '檢驗追蹤', '衛教諮詢', '轉介銜接', '電話/LINE/視訊等遠距方式', '其他'],
            settingOptions: ['全日住院', '居住照護', '日間留院', '門診', '其他'],
            doseType: 'treatment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-3d': {
            kind: 'treatment',
            title: '3d. 社會/職業功能及復元支持-復健/培力',
            targetLabel: '執行標的',
            targetOptions: ['生活適應', '職業功能', '社會福利資源需求', '其他'],
            itemLabel: '治療／處置／復健項目',
            itemOptions: ['職業功能訓練', '生活重建', '社福資源連結', '家庭支持', '同儕支持', '復元團體', '就業/就學銜接', '其他'],
            methodLabel: '執行方式',
            methodOptions: ['個別', '團體', '家屬', '外展', '資源連結', '電話/LINE/視訊等遠距方式', '其他'],
            settingOptions: ['全日住院', '居住照護', '日間留院', '門診', '其他'],
            doseType: 'treatment',
            notePlaceholder: '具體施行模式說明'
        },
        'matrix-4x': {
            kind: 'simple-note',
            title: '4. 不適用/無法填寫',
            itemLabel: '無法歸類原因',
            itemOptions: ['既有分類不足', '方案尚未定型', '資料院內無法取得', '非直接服務方案', '其他'],
            targetLabel: '最接近哪一類',
            targetOptions: ['篩檢／評估', '短期介入／衛教／轉介', '專業治療', '復健／支持', '無法判定'],
            methodLabel: '簡要說明',
            methodOptions: [],
            settingOptions: [],
            doseType: 'none',
            notePlaceholder: '請簡要說明原因'
        }
    };

    const container = document.getElementById('dynamic-program-container');
    const placeholder = document.getElementById('dynamic-placeholder');
    let hasUnsavedChanges = false;

    function markFieldTouched(field) {
        if (!field) return;
        field.dataset.userTouched = '1';
    }

    function markFormDirty() {
        hasUnsavedChanges = true;
    }

    function markFormExported() {
        hasUnsavedChanges = false;
    }

    function hasMeaningfulFieldValue(field) {
        if (!field || field.disabled) return false;
        const type = (field.type || '').toLowerCase();

        if (type === 'checkbox' || type === 'radio') {
            return !!field.checked;
        }

        if (field.tagName === 'SELECT') {
            return field.dataset.userTouched === '1' && (field.value || '').trim() !== '';
        }

        return (field.value || '').trim() !== '';
    }

    function hasMeaningfulSectionData(section) {
        if (!section) return false;
        return Array.from(section.querySelectorAll('input, select, textarea')).some(function (field) {
            return hasMeaningfulFieldValue(field);
        });
    }

    document.addEventListener('input', function (event) {
        const field = event.target.closest('input, textarea');
        if (!field) return;
        markFieldTouched(field);
        markFormDirty();
    }, true);

    document.addEventListener('change', function (event) {
        const field = event.target.closest('input, select, textarea');
        if (!field) return;
        markFieldTouched(field);
        markFormDirty();
    }, true);

    document.addEventListener('click', function (event) {
        const button = event.target.closest('button');
        if (!button) return;
        if (button.id === 'export-json-btn' || button.id === 'secure-print-btn') return;
        markFormDirty();
    }, true);

    function bindStaticOtherFieldToggle(groupField, otherField) {
        const otherCheckbox = document.querySelector(`input[type="checkbox"][data-field="${groupField}"][value="其他"]`);
        const otherInput = document.querySelector(`[data-field="${otherField}"]`);

        if (!otherCheckbox || !otherInput) return;

        const update = function () {
            const active = otherCheckbox.checked;
            otherInput.disabled = !active;
            otherInput.style.display = active ? '' : 'none';

            if (!active) {
                otherInput.value = '';
            }
        };

        otherCheckbox.addEventListener('change', update);
        update();
    }

    bindStaticOtherFieldToggle('recipients', 'recipients_other');
    bindStaticOtherFieldToggle('target_age_groups', 'target_age_group_other');
    bindStaticOtherFieldToggle('gender_groups', 'gender_group_other');
    bindStaticOtherFieldToggle('co_occurring_special_populations', 'co_occurring_special_population_other');
    bindStaticOtherFieldToggle('primary_substances', 'primary_substances_other');

    window.addEventListener('beforeunload', function (event) {
        if (!hasUnsavedChanges) return;
        event.preventDefault();
        event.returnValue = '';
    });

    // 2. 監聽矩陣勾選盒狀態
    document.querySelectorAll('.matrix-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.id;
            if (e.target.checked) {
                renderSection(id);
            } else {
                const currentSection = document.getElementById(`section-block-${id}`);
                if (hasMeaningfulSectionData(currentSection)) {
                    const confirmed = window.confirm('取消此項會移除第四區塊目前已填寫的資料，是否繼續？');
                    if (!confirmed) {
                        e.target.checked = true;
                        return;
                    }
                }
                removeSection(id);
            }
            togglePlaceholder();
            if (typeof refreshSection5StageFrequencyBlocks === 'function') {
                refreshSection5StageFrequencyBlocks();
            }
            markFormDirty();
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
    const originalDocumentTitle = document.title;
    window.addEventListener('afterprint', function () {
        document.title = originalDocumentTitle;
    });
    const hospitalProgramData = {
        '國立成功大學醫學院附設醫院': {
            directorName: '王姿云',
            directorTitle: '醫師',
            programs: [
                {
                    label: '精進非鴉片類藥癮治療方案-結合虛擬實境技術發展針對渴求感的生理回饋訓練',
                    meta: '方案一、基本承作'
                }
            ]
        },
        '高雄市立凱旋醫院': {
            directorName: '黃敏偉',
            directorTitle: '副院長',
            programs: [
                {
                    label: '評估篩檢與基本治療模式',
                    meta: '方案一、基本承作+選作'
                },
                {
                    label: '共病治療模式',
                    meta: '方案二、基本承作'
                },
                {
                    label: '特殊族群治療模式【女性、兒青、藥愛】【新興物質、喪屍菸彈(依托咪酯Etomidate)】',
                    meta: '方案三、基本承作+選作'
                }
            ]
        },
        '臺北市立聯合醫院松德院區': {
            directorName: '黃名琪',
            directorTitle: '院長',
            programs: [
                {
                    label: '難治型族群方案',
                    meta: '方案一、基本承作+選作'
                },
                {
                    label: '藥愛族群方案',
                    meta: '方案二、基本承作'
                },
                {
                    label: '特殊族群方案【女性、青少年】',
                    meta: '方案三、基本承作+選作'
                }
            ]
        },
        '奇美醫療財團法人奇美醫院': {
            directorName: '張志誠',
            directorTitle: '科主任',
            programs: [
                {
                    label: '以非口語形式為主之遊戲與藝術覺察團體',
                    meta: '方案一、基本承作'
                },
                {
                    label: '發展結合正念與睡眠行為治療團體方案',
                    meta: '方案二、基本承作'
                }
            ]
        },
        '衛生福利部嘉南療養院': {
            directorName: '吳文正',
            directorTitle: '院長',
            programs: [
                {
                    label: '非鴉片類藥癮治療多元處遇（腦心智融合正念預防復發、藥愛團體、ID智能小團體、Satir家族關係探索團體、賦能成長敘事團體、水川模式繪畫敘事治療團體）',
                    meta: '方案一、基本承作+選作'
                },
                {
                    label: '以神經功能的心理治療取向',
                    meta: '方案二、基本承作'
                },
                {
                    label: '特殊藥癮族群及共病治療模式【藥愛、青少年、C肝共病】【新興物質、喪屍菸彈(依托咪酯Etomidate)】',
                    meta: '方案三、基本承作'
                }
            ]
        },
        '衛生福利部草屯療養院': {
            directorName: '丁碩彥',
            directorTitle: '院長',
            programs: [
                {
                    label: '藥癮處遇暨個案管理模式【青少年】',
                    meta: '方案一、基本承作+選作'
                },
                {
                    label: '提升成癮者心理社會治療服務計畫',
                    meta: '方案二、基本承作+選作'
                },
                {
                    label: '特殊族群藥癮治療服務方案【女性】',
                    meta: '方案三、基本承作+選作'
                }
            ]
        },
        '衛生福利部桃園療養院': {
            directorName: '邱献章',
            directorTitle: '院長',
            programs: [
                {
                    label: '女性藥癮者整合式照護模式【女性】',
                    meta: '方案一、基本承作+選作'
                },
                {
                    label: '「精準照護，身心康復」—藥癮精神共病個案整合性雙重診斷治療計畫',
                    meta: '方案二、基本承作'
                },
                {
                    label: '興奮劑與新興物質成癮族群: 從治療門徑到復元支持之整合性持續照護模式【青少年】【新興物質、依托咪酯（Etomidate）】',
                    meta: '方案三、基本承作'
                }
            ]
        },
        '衛生福利部玉里醫院': {
            directorName: '簡以嘉',
            directorTitle: '院長',
            programs: [
                {
                    label: '偏鄉非鴉片類藥癮治療多元處遇模式方案',
                    meta: '(新)方案一、基本承作'
                }
            ]
        }
    };

    function createOption(value, text, selected = false) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        if (selected) option.selected = true;
        return option;
    }

    function stripBracketSegments(text) {
        return (text || '')
            .replace(/【[^】]*】/g, '')
            .replace(/\[[^\]]*\]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function getDisplayProgramLabel(text) {
        return stripBracketSegments(text);
    }

    function initSection1Selects() {
        const agencySelect = document.getElementById('operating-agency');
        const programSelect = document.getElementById('program-name');
        const directorName = document.getElementById('program-director-name');
        const directorTitle = document.getElementById('program-director-title');

        if (!agencySelect || !programSelect || !directorName || !directorTitle) return;

        agencySelect.innerHTML = '';
        programSelect.innerHTML = '';

        agencySelect.appendChild(createOption('', '請選擇執行/營運單位'));
        programSelect.appendChild(createOption('', '請先選擇執行/營運單位'));

        Object.keys(hospitalProgramData).forEach(function (hospital) {
            agencySelect.appendChild(createOption(hospital, hospital));
        });

        function populateProgramOptions(hospitalName) {
            programSelect.innerHTML = '';
            programSelect.appendChild(createOption('', '請選擇計畫方案名稱'));

            if (!hospitalName) {
                return;
            }

            const hospitalData = hospitalProgramData[hospitalName];
            (hospitalData?.programs || []).forEach(function (program) {
                const displayLabel = getDisplayProgramLabel(program.label) || program.label;
                const option = createOption(program.label, displayLabel);
                option.dataset.programMeta = program.meta || '';
                programSelect.appendChild(option);
            });
        }

        agencySelect.addEventListener('change', function () {
            const hospitalName = agencySelect.value;
            if (hospitalName) {
                const hospitalData = hospitalProgramData[hospitalName];
                directorName.value = hospitalData?.directorName || '';
                directorTitle.value = hospitalData?.directorTitle || '';
                populateProgramOptions(hospitalName);
                programSelect.value = '';
            } else {
                directorName.value = '';
                directorTitle.value = '';
                populateProgramOptions('');
            }
        });

        programSelect.addEventListener('change', function () {
            if (!programSelect.value) return;
            const selectedProgram = programSelect.value;
            const matchedHospital = Object.keys(hospitalProgramData).find(function (hospital) {
                return hospitalProgramData[hospital].programs.some(function (program) {
                    return program.label === selectedProgram;
                });
            });
            if (!matchedHospital) return;

            const hospitalData = hospitalProgramData[matchedHospital];
            directorName.value = hospitalData?.directorName || '';
            directorTitle.value = hospitalData?.directorTitle || '';

            if (agencySelect.value !== matchedHospital) {
                agencySelect.value = matchedHospital;
                populateProgramOptions(matchedHospital);
                programSelect.value = selectedProgram;
            }
        });

        agencySelect.value = '';
        populateProgramOptions('');
        directorName.value = '';
        directorTitle.value = '';
    }

    initSection1Selects();

    // 🌟 2026 標準：定義完整的嚴格法定排序順序
    const strictOrder = [
        'matrix-1a', 'matrix-1b', 'matrix-1c', 'matrix-1d',
        'matrix-2a', 'matrix-2b', 'matrix-2c', 'matrix-2d',
        'matrix-3a', 'matrix-3b', 'matrix-3c', 'matrix-3d',
        'matrix-4x'
    ];

    function insertSectionByOrder(sectionDiv, id) {
        const currentSections = Array.from(container.querySelectorAll('.dynamic-section'));
        const targetIndex = strictOrder.indexOf(id);
        let insertBeforeTarget = null;

        for (const existingSection of currentSections) {
            const existingId = existingSection.getAttribute('data-matrix-id');
            const existingIndex = strictOrder.indexOf(existingId);
            if (existingIndex > targetIndex) {
                insertBeforeTarget = existingSection;
                break;
            }
        }

        if (insertBeforeTarget) {
            container.insertBefore(sectionDiv, insertBeforeTarget);
        } else {
            container.appendChild(sectionDiv);
        }
    }

    function createSectionShell(id, config) {
        const sectionDiv = document.createElement('div');
        sectionDiv.id = `section-block-${id}`;
        sectionDiv.setAttribute('data-matrix-id', id);
        sectionDiv.className = 'dynamic-section bg-white p-5 rounded-lg border border-gray-300 shadow-sm relative no-break';

        const headTitle = document.createElement('h3');
        headTitle.className = 'text-base font-bold text-gray-800 mb-4 border-l-4 border-blue-600 pl-2';
        headTitle.textContent = config.title;
        sectionDiv.appendChild(headTitle);

        return sectionDiv;
    }

    function clearNode(node) {
        if (!node) return;
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function createFieldTextarea(fieldName, rowPrefix, placeholder, className) {
        const textarea = document.createElement('textarea');
        textarea.rows = 2;
        textarea.placeholder = placeholder;
        textarea.dataset.field = fieldName;
        if (rowPrefix) textarea.dataset.rowPrefix = rowPrefix;
        textarea.className = className || 'w-full min-h-[48px] resize-none border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none';
        return textarea;
    }

    function createFieldText(fieldName, rowPrefix, placeholder, className) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.dataset.field = fieldName;
        if (rowPrefix) input.dataset.rowPrefix = rowPrefix;
        input.className = className || 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none';
        return input;
    }

    function createFieldNumber(fieldName, rowPrefix, placeholder, className) {
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = placeholder || '0';
        input.dataset.field = fieldName;
        if (rowPrefix) input.dataset.rowPrefix = rowPrefix;
        input.className = className || 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none';
        return input;
    }

    function createFieldSelect(fieldName, rowPrefix, options, className) {
        const select = document.createElement('select');
        select.dataset.field = fieldName;
        if (rowPrefix) select.dataset.rowPrefix = rowPrefix;
        select.className = className || 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none';
        options.forEach(function (item) {
            if (item && item.group) {
                const group = document.createElement('optgroup');
                group.label = item.group;
                item.options.forEach(function (subItem) {
                    group.appendChild(createOption(subItem.value, subItem.text, subItem.selected));
                });
                select.appendChild(group);
            } else {
                select.appendChild(createOption(item.value, item.text, item.selected));
            }
        });
        return select;
    }

    function createChoiceLabel(type, fieldName, rowPrefix, value, text, options) {
        const label = document.createElement('label');
        label.className = options?.labelClass || 'inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700';

        const input = document.createElement('input');
        input.type = type;
        input.value = value;
        input.dataset.field = fieldName;
        if (rowPrefix && type === 'radio') {
            input.name = `${rowPrefix}_${fieldName}`;
        }
        if (options?.checked) input.checked = true;
        if (options?.className) input.className = options.className;

        label.appendChild(input);
        label.appendChild(document.createTextNode(text));

        if (options?.otherField) {
            const other = createFieldText(options.otherField, rowPrefix, options.otherPlaceholder || '請輸入其他內容', options.otherClassName || 'inline-input w-32 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none');
            other.dataset.otherFor = fieldName;
            other.style.display = 'none';
            other.disabled = true;
            label.appendChild(other);
        }

        return label;
    }

    function buildChoiceGroup(config) {
        const wrap = document.createElement('div');
        wrap.className = config.className || 'flex flex-wrap gap-2';

        (config.options || []).forEach(function (item) {
            const isOther = !!item.other;
            const label = createChoiceLabel(
                config.type,
                config.field,
                config.rowPrefix,
                item.value,
                isOther ? `${item.text}：` : item.text,
                {
                    className: config.inputClass || 'mt-0.5',
                    labelClass: config.labelClass,
                    otherField: isOther ? config.otherField || `${config.field}_other` : null,
                    otherPlaceholder: config.otherPlaceholder || '請輸入其他內容',
                    otherClassName: config.otherClassName
                }
            );
            wrap.appendChild(label);
        });

        const updateOtherVisibility = function () {
            wrap.querySelectorAll('label').forEach(function (label) {
                const choiceInput = label.querySelector(`input[type="${config.type}"]`);
                const otherInput = label.querySelector('input[type="text"][data-other-for]');
                if (!choiceInput || !otherInput) return;

                const showOther = !!choiceInput.checked;
                otherInput.style.display = showOther ? '' : 'none';
                otherInput.disabled = !showOther;
                if (!showOther) {
                    otherInput.value = '';
                }
            });
        };

        wrap.querySelectorAll(`input[type="${config.type}"]`).forEach(function (input) {
            input.addEventListener('change', updateOtherVisibility);
        });
        updateOtherVisibility();

        return wrap;
    }

    function buildFrequencyBlock(rowPrefix, baseField, titleText) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-2';

        const radioRow = document.createElement('div');
        radioRow.className = 'flex flex-wrap gap-2';

        const single = createChoiceLabel('radio', `${baseField}_mode`, rowPrefix, 'single', '一次性', {
            className: 'mt-0.5'
        });
        const repeat = createChoiceLabel('radio', `${baseField}_mode`, rowPrefix, 'repeat', '重複性', {
            className: 'mt-0.5'
        });

        radioRow.appendChild(single);
        radioRow.appendChild(repeat);
        wrap.appendChild(radioRow);

        const repeatPanel = document.createElement('div');
        repeatPanel.className = 'hidden flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm';

        repeatPanel.appendChild(document.createTextNode(titleText || '每'));
        repeatPanel.appendChild(createFieldNumber(`${baseField}_every_value`, rowPrefix, ''));

        const unit = createFieldSelect(
            `${baseField}_every_unit`,
            rowPrefix,
            [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ],
            'inline-select w-20 border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'
        );
        repeatPanel.appendChild(unit);

        repeatPanel.appendChild(createFieldNumber(`${baseField}_every_times`, rowPrefix, ''));
        repeatPanel.appendChild(document.createTextNode('次'));
        wrap.appendChild(repeatPanel);

        const singleRadio = single.querySelector('input');
        const repeatRadio = repeat.querySelector('input');
        const updateVisibility = function () {
            repeatPanel.classList.toggle('hidden', !repeatRadio.checked);
        };
        singleRadio.addEventListener('change', updateVisibility);
        repeatRadio.addEventListener('change', updateVisibility);
        updateVisibility();

        return wrap;
    }

    function createCardShell(cardClass) {
        const card = document.createElement('div');
        card.className = `section4-card ${cardClass}`.trim();
        return card;
    }

    function createModuleCard(titleText) {
        const card = document.createElement('section');
        card.className = 'section4-card module-subcard';

        const title = document.createElement('div');
        title.className = 'field-group-title';
        title.textContent = titleText;
        card.appendChild(title);

        return card;
    }

    function createCardDeleteButton(onDelete) {
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'card-delete-btn inline-flex items-center rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-bold text-red-600 shadow-sm transition-colors hover:bg-red-50 hover:text-red-700';
        delBtn.textContent = '刪除';
        delBtn.addEventListener('click', onDelete);
        return delBtn;
    }

    function createFieldGroup(titleText, contentNode, options) {
        const group = document.createElement('section');
        group.className = 'field-group';

        if (titleText) {
            const title = document.createElement('div');
            title.className = 'field-group-title';
            title.textContent = titleText;
            group.appendChild(title);
        }

        if (options?.subtitle) {
            const subtitle = document.createElement('div');
            subtitle.className = 'mb-2 text-xs text-slate-500';
            subtitle.textContent = options.subtitle;
            group.appendChild(subtitle);
        }

        if (contentNode) {
            group.appendChild(contentNode);
        }

        return group;
    }

    function createCompactChoiceGroup(config) {
        return buildChoiceGroup({
            type: config.type,
            field: config.field,
            rowPrefix: config.rowPrefix,
            options: config.options,
            className: config.className || 'option-grid',
            labelClass: 'compact-option',
            otherField: config.otherField,
            otherPlaceholder: config.otherPlaceholder,
            otherClassName: 'inline-input w-40 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
        });
    }

    function createFrequencyControl(rowPrefix, baseField) {
        const wrap = document.createElement('div');
        wrap.className = 'compact-frequency space-y-2';

        const toggleRow = createCompactChoiceGroup({
            type: 'radio',
            field: `${baseField}_mode`,
            rowPrefix,
            options: [
                { text: '一次性', value: 'single' },
                { text: '重複性', value: 'repeat' }
            ],
            className: 'option-grid'
        });
        wrap.appendChild(toggleRow);

        const repeatPanel = document.createElement('div');
        repeatPanel.className = 'hidden compact-frequency-row flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-sm';
        repeatPanel.appendChild(document.createTextNode('每'));
        repeatPanel.appendChild(createFieldNumber(`${baseField}_every_value`, rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
        repeatPanel.appendChild(createFieldSelect(
            `${baseField}_every_unit`,
            rowPrefix,
            [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ],
            'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'
        ));
        repeatPanel.appendChild(createFieldNumber(`${baseField}_every_times`, rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
        repeatPanel.appendChild(document.createTextNode('次'));
        wrap.appendChild(repeatPanel);

        const radios = Array.from(toggleRow.querySelectorAll('input[type="radio"]'));
        const updateVisibility = function () {
            const checked = radios.find(function (item) { return item.checked; });
            repeatPanel.classList.toggle('hidden', checked?.value !== 'repeat');
        };
        radios.forEach(function (radio) {
            radio.addEventListener('change', updateVisibility);
        });
        updateVisibility();

        return wrap;
    }

    function createServiceOptions(config) {
        const items = config.options || [];
        return createCompactChoiceGroup({
            type: config.type,
            field: config.field,
            rowPrefix: config.rowPrefix,
            options: items,
            className: 'option-grid',
            otherField: config.otherField,
            otherPlaceholder: config.otherPlaceholder
        });
    }

    function normalizeTemplateOptions(options) {
        return (options || []).map(function (item) {
            if (typeof item === 'string') {
                return item.includes('其他')
                    ? { text: item, value: item, other: true }
                    : { text: item, value: item };
            }
            return item;
        });
    }

    function buildTemplateChoiceGroup(titleText, fieldName, rowPrefix, options, config) {
        return createFieldGroup(titleText, createCompactChoiceGroup({
            type: config?.type || 'radio',
            field: fieldName,
            rowPrefix,
            options: normalizeTemplateOptions(options),
            otherField: config?.otherField,
            otherPlaceholder: config?.otherPlaceholder || '請輸入其他內容'
        }));
    }

    function buildTemplateTextareaGroup(titleText, fieldName, rowPrefix, placeholder) {
        return createFieldGroup(titleText, createFieldTextarea(fieldName, rowPrefix, placeholder));
    }

    function createCompactFrequencyLine(rowPrefix, baseField, unitOptions) {
        const wrap = document.createElement('div');
        wrap.className = 'compact-frequency';
        wrap.appendChild(document.createTextNode('每'));
        wrap.appendChild(createFieldNumber(`${baseField}_value`, rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
        wrap.appendChild(createFieldSelect(
            `${baseField}_unit`,
            rowPrefix,
            normalizeTemplateOptions(unitOptions),
            'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'
        ));
        wrap.appendChild(createFieldNumber(`${baseField}_times`, rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
        wrap.appendChild(document.createTextNode('次'));
        return wrap;
    }

    function createMultiSelectFieldGroup(titleText, fieldName, rowPrefix, options, config) {
        return createFieldGroup(titleText, createCompactChoiceGroup({
            type: 'checkbox',
            field: fieldName,
            rowPrefix,
            options: normalizeTemplateOptions(options),
            otherField: config?.otherField,
            otherPlaceholder: config?.otherPlaceholder || '請輸入其他內容'
        }));
    }

    function createSingleSelectFieldGroup(titleText, fieldName, rowPrefix, options, config) {
        return createFieldGroup(titleText, createCompactChoiceGroup({
            type: 'radio',
            field: fieldName,
            rowPrefix,
            options: normalizeTemplateOptions(options),
            otherField: config?.otherField,
            otherPlaceholder: config?.otherPlaceholder || '請輸入其他內容'
        }));
    }

    function createSelectWithOther(fieldName, rowPrefix, options, placeholder, otherFieldName) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-2';

        const select = createFieldSelect(fieldName, rowPrefix, [
            { value: '', text: placeholder || '-- 請選擇 --', selected: true }
        ].concat(normalizeTemplateOptions(options || [])), 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none');

        const otherInput = createFieldText(
            otherFieldName || `${fieldName}_other`,
            rowPrefix,
            '請輸入其他內容',
            'hidden inline-input w-48 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
        );
        otherInput.dataset.otherFor = fieldName;

        const updateOtherVisibility = function () {
            const showOther = (select.value || '').includes('其他');
            otherInput.classList.toggle('hidden', !showOther);
            if (!showOther) {
                otherInput.value = '';
            }
        };

        select.addEventListener('change', updateOtherVisibility);
        updateOtherVisibility();

        wrap.appendChild(select);
        wrap.appendChild(otherInput);
        return wrap;
    }

    function createSelectFieldGroup(titleText, fieldName, rowPrefix, options, placeholder) {
        const select = createFieldSelect(fieldName, rowPrefix, [
            { value: '', text: placeholder || '-- 請選擇 --', selected: true }
        ].concat(normalizeTemplateOptions(options || [])), 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none');
        return createFieldGroup(titleText, select);
    }

    function createUnifiedDoseBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-4';

        const modeGroup = createFieldGroup('服務安排', createFieldSelect('dose_mode', rowPrefix, [
            { value: '', text: '-- 請選擇 --', selected: true },
            { value: 'once', text: '一次性' },
            { value: 'repeated', text: '重複性' }
        ], 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
        wrap.appendChild(modeGroup);

        const oncePanel = document.createElement('div');
        oncePanel.className = 'dose-panel space-y-2 hidden';
        oncePanel.dataset.dosePanel = 'once';
        oncePanel.appendChild(createFieldGroup('單次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('single_minutes', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));
        wrap.appendChild(oncePanel);

        const repeatedPanel = document.createElement('div');
        repeatedPanel.className = 'dose-panel space-y-3 hidden';
        repeatedPanel.dataset.dosePanel = 'repeated';
        repeatedPanel.appendChild(createFieldGroup('期程長度', (function () {
            const line = document.createElement('div');
            line.className = 'compact-frequency';
            line.appendChild(createFieldNumber('duration_value', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('duration_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })()));
        repeatedPanel.appendChild(createFieldGroup('期程內總次數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('total_count', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })()));
        repeatedPanel.appendChild(createFieldGroup('每次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('minutes_per_session', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));
        wrap.appendChild(repeatedPanel);

        const select = modeGroup.querySelector('select[data-field="dose_mode"]');
        const updateVisibility = function () {
            const value = select?.value || '';
            oncePanel.classList.toggle('hidden', value !== 'once');
            repeatedPanel.classList.toggle('hidden', value !== 'repeated');
        };
        if (select) {
            select.addEventListener('change', updateVisibility);
        }
        updateVisibility();

        return wrap;
    }

    function createMedicationCourseBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';

        const modeGroup = createFieldGroup('期程型態', createCompactChoiceGroup({
            type: 'radio',
            field: 'course_mode',
            rowPrefix,
            options: [
                { text: '有限期程', value: 'limited' },
                { text: '維持療法或無固定期程', value: 'maintenance' },
                { text: '不適用', value: 'not_applicable' }
            ]
        }));
        wrap.appendChild(modeGroup);

        const durationGroup = createFieldGroup('期程長度', (function () {
            const line = document.createElement('div');
            line.className = 'compact-frequency';
            line.appendChild(createFieldNumber('course_duration_value', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('course_duration_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })());
        durationGroup.classList.add('hidden');
        wrap.appendChild(durationGroup);

        const select = modeGroup.querySelector('input[type="radio"]');
        const radios = Array.from(modeGroup.querySelectorAll('input[type="radio"]'));
        const clearFields = function (names) {
            names.forEach(function (fieldName) {
                wrap.querySelectorAll(`[data-field="${fieldName}"]`).forEach(function (field) {
                    if (field.tagName === 'SELECT') {
                        field.selectedIndex = 0;
                    } else {
                        field.value = '';
                    }
                });
            });
        };
        const updateVisibility = function () {
            const checked = modeGroup.querySelector('input[type="radio"]:checked');
            const mode = checked ? checked.value : '';
            durationGroup.classList.toggle('hidden', mode !== 'limited');
            if (mode === 'maintenance' || mode === 'not_applicable') {
                clearFields(['course_duration_value', 'course_duration_unit']);
            }
        };
        radios.forEach(function (radio) {
            radio.addEventListener('change', updateVisibility);
        });
        updateVisibility();

        return wrap;
    }

    function createNonMedicationCourseBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';
        const isPsychiatricNonMedication = String(rowPrefix || '').includes('psychiatric_non_medication');

        const modeGroup = createFieldGroup('期程型態', createCompactChoiceGroup({
            type: 'radio',
            field: 'course_mode',
            rowPrefix,
            options: [
                { text: '有限期程', value: 'limited' },
                { text: '維持療法或無固定期程', value: 'maintenance' },
                { text: '不適用', value: 'not_applicable' }
            ]
        }));
        wrap.appendChild(modeGroup);

        const durationGroup = createFieldGroup('期程長度', (function () {
            const line = document.createElement('div');
            line.className = 'compact-frequency';
            line.appendChild(createFieldNumber('course_duration_value', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('course_duration_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })());
        wrap.appendChild(durationGroup);

        const totalGroup = createFieldGroup('期程內治療總次數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('course_total_count', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })());
        wrap.appendChild(totalGroup);

        const frequencyGroup = createFieldGroup('治療頻率', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(document.createTextNode('平均每'));
            line.appendChild(createFieldNumber('frequency_period_value', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('frequency_period_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'w-20 border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('內'));
            line.appendChild(createFieldNumber('frequency_count', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })());
        wrap.appendChild(frequencyGroup);

        const radios = Array.from(modeGroup.querySelectorAll('input[type="radio"]'));
        const clearFields = function (names) {
            names.forEach(function (fieldName) {
                wrap.querySelectorAll(`[data-field="${fieldName}"]`).forEach(function (field) {
                    if (field.tagName === 'SELECT') {
                        field.selectedIndex = 0;
                    } else {
                        field.value = '';
                    }
                });
            });
        };
        const updateVisibility = function () {
            const checked = modeGroup.querySelector('input[type="radio"]:checked');
            const mode = checked ? checked.value : '';
            if (isPsychiatricNonMedication) {
                durationGroup.classList.toggle('hidden', mode !== 'limited');
                totalGroup.classList.toggle('hidden', mode !== 'limited');
                frequencyGroup.classList.toggle('hidden', mode === 'not_applicable' || !mode);
                if (mode === 'maintenance') {
                    clearFields(['course_duration_value', 'course_duration_unit', 'course_total_count']);
                } else if (mode === 'not_applicable') {
                    clearFields(['course_duration_value', 'course_duration_unit', 'course_total_count', 'frequency_period_value', 'frequency_period_unit', 'frequency_count']);
                }
                return;
            }

            const isLimited = mode === 'limited';
            const isMaintenance = mode === 'maintenance';

            durationGroup.classList.toggle('hidden', !isLimited);
            totalGroup.classList.toggle('hidden', !isLimited);
            frequencyGroup.classList.toggle('hidden', !isMaintenance);

            if (isLimited) {
                clearFields([
                    'frequency_period_value',
                    'frequency_period_unit',
                    'frequency_count'
                ]);
            } else if (isMaintenance) {
                clearFields([
                    'course_duration_value',
                    'course_duration_unit',
                    'course_total_count'
                ]);
            } else {
                clearFields([
                    'course_duration_value',
                    'course_duration_unit',
                    'course_total_count',
                    'frequency_period_value',
                    'frequency_period_unit',
                    'frequency_count'
                ]);
            }
        };
        radios.forEach(function (radio) {
            radio.addEventListener('change', updateVisibility);
        });
        updateVisibility();

        return wrap;
    }

    function createPsychosocialCourseBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';

        const modeGroup = createFieldGroup('期程型態', createCompactChoiceGroup({
            type: 'radio',
            field: 'course_mode',
            rowPrefix,
            options: [
                { text: '有限期程', value: 'limited' },
                { text: '無固定期程', value: 'open_ended' },
                { text: '不適用', value: 'not_applicable' }
            ]
        }));
        wrap.appendChild(modeGroup);

        const durationGroup = createFieldGroup('期程長度', (function () {
            const line = document.createElement('div');
            line.className = 'compact-frequency';
            line.appendChild(createFieldNumber('course_duration_value', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('course_duration_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })());
        wrap.appendChild(durationGroup);

        const frequencyGroup = createFieldGroup('治療頻率', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('frequency_count', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次 /'));
            line.appendChild(createFieldSelect('frequency_period_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'w-20 border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('內'));
            return line;
        })());
        wrap.appendChild(frequencyGroup);

        const minutesGroup = createFieldGroup('每次時間', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('minutes_per_session', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })());
        wrap.appendChild(minutesGroup);

        const radios = Array.from(modeGroup.querySelectorAll('input[type="radio"]'));
        const clearFields = function (names) {
            names.forEach(function (fieldName) {
                wrap.querySelectorAll(`[data-field="${fieldName}"]`).forEach(function (field) {
                    if (field.tagName === 'SELECT') {
                        field.selectedIndex = 0;
                    } else {
                        field.value = '';
                    }
                });
            });
        };
        const updateVisibility = function () {
            const checked = modeGroup.querySelector('input[type="radio"]:checked');
            const mode = checked ? checked.value : '';
            durationGroup.classList.toggle('hidden', mode !== 'limited');
            frequencyGroup.classList.toggle('hidden', mode === 'not_applicable' || !mode);
            minutesGroup.classList.toggle('hidden', mode === 'not_applicable' || !mode);
            if (mode === 'open_ended') {
                clearFields(['course_duration_value', 'course_duration_unit']);
            } else if (mode === 'not_applicable') {
                clearFields(['course_duration_value', 'course_duration_unit', 'frequency_count', 'frequency_period_unit', 'minutes_per_session']);
            }
        };
        radios.forEach(function (radio) {
            radio.addEventListener('change', updateVisibility);
        });
        updateVisibility();

        return wrap;
    }

    function createExecutionSitesFieldGroup(rowPrefix) {
        return createSingleSelectFieldGroup('執行場域', 'execution_sites', rowPrefix, ['全日住院', '居住照護', '日間留院', '門診', '其他'], {
            otherField: 'execution_sites_other'
        });
    }

    function createMedicationTreatmentCard(rowPrefix) {
        const detailPrefix = `${rowPrefix}_primary_medication`;
        const panel = createModuleCard('藥物治療');
        panel.classList.add('treatment-detail-panel');
        panel.dataset.detailGroup = 'biological-medication';
        panel.dataset.detailKey = 'primary_medication';
        panel.dataset.detailPrefix = detailPrefix;
        panel.dataset.itemLabel = '藥物治療';

        const detailBody = document.createElement('div');
        detailBody.className = 'space-y-4';

        const note = document.createElement('div');
        note.className = 'text-xs text-slate-500';
        note.textContent = '請以本方案主要使用的藥物為準';
        detailBody.appendChild(note);

        detailBody.appendChild(createFieldGroup('藥物種類', createSelectWithOther('medication_type', detailPrefix, [
            '美沙冬',
            '丁基原啡因',
            '拿萃松（Naltrexone）',
            '阿坎酸（Acamprosate）',
            '二硫倫（Disulfiram）',
            '尼古丁替代治療',
            '伐尼克蘭（Varenicline）',
            '苯二氮平類鎮定劑（BZD）',
            '其他藥物'
        ], '-- 請選擇 --', 'medication_type_other')));
        detailBody.appendChild(createMedicationCourseBlock(detailPrefix));
        detailBody.appendChild(buildTemplateTextareaGroup('項目說明', 'note', detailPrefix, '請說明此藥物治療之實際執行方式'));

        panel.appendChild(detailBody);
        return panel;
    }

    function createNonMedicationTreatmentCard(rowPrefix, itemKey, title, options) {
        const detailPrefix = `${rowPrefix}_${itemKey}`;
        const panel = createModuleCard(title);
        panel.classList.add('treatment-detail-panel');
        panel.dataset.detailGroup = options.group || 'biological-non-medication';
        panel.dataset.detailKey = itemKey;
        panel.dataset.detailPrefix = detailPrefix;
        panel.dataset.itemLabel = title;

        const detailBody = document.createElement('div');
        detailBody.className = 'space-y-4';

        if (options.otherFieldName) {
            const otherInput = createFieldText(
                options.otherFieldName,
                detailPrefix,
                options.otherPlaceholder || '請輸入其他內容',
                'inline-input w-56 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
            );
            detailBody.appendChild(createFieldGroup(options.otherFieldLabel || '其他名稱', otherInput));
        }

        detailBody.appendChild(createNonMedicationCourseBlock(detailPrefix));
        detailBody.appendChild(buildTemplateTextareaGroup('項目說明', 'note', detailPrefix, options.notePlaceholder || '請說明此項目的實際執行方式'));

        panel.appendChild(detailBody);
        return panel;
    }

    function createPsychosocialTreatmentCard(rowPrefix, itemKey, title, options) {
        const detailPrefix = `${rowPrefix}_${itemKey}`;
        const panel = createModuleCard(title);
        panel.classList.add('treatment-detail-panel');
        panel.dataset.detailGroup = options.group || 'psychosocial';
        panel.dataset.detailKey = itemKey;
        panel.dataset.detailPrefix = detailPrefix;
        panel.dataset.itemLabel = title;

        const detailBody = document.createElement('div');
        detailBody.className = 'space-y-4';

        if (options.otherFieldName) {
            const otherInput = createFieldText(
                options.otherFieldName,
                detailPrefix,
                options.otherPlaceholder || '請輸入其他內容',
                'inline-input w-56 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
            );
            detailBody.appendChild(createFieldGroup(options.otherFieldLabel || '其他名稱', otherInput));
        }

        if (options.includeFormats) {
            detailBody.appendChild(createMultiSelectFieldGroup('服務形式', 'psychosocial_formats', detailPrefix, [
                '個別',
                '團體',
                '家庭',
                '其他'
            ], { otherField: 'psychosocial_formats_other' }));
        }

        detailBody.appendChild(createPsychosocialCourseBlock(detailPrefix));
        detailBody.appendChild(buildTemplateTextareaGroup('項目說明', 'note', detailPrefix, options.notePlaceholder || '請說明此項目的實際執行方式'));

        panel.appendChild(detailBody);
        return panel;
    }

    function createPsychosocialCustomItemCard(rowPrefix, index, preservedData) {
        const detailPrefix = `${rowPrefix}_psych_custom_${index}`;
        const card = createModuleCard(`心理社會治療項目 ${index}`);
        card.classList.add('treatment-detail-panel');
        card.dataset.detailGroup = 'psychosocial-custom';
        card.dataset.detailKey = `psych_custom_${index}`;
        card.dataset.detailPrefix = detailPrefix;
        card.dataset.psychosocialCustom = '1';
        card.dataset.parentMatrix = rowPrefix.indexOf('matrix-3b') === 0 ? 'matrix-3b' : 'matrix-3a';
        card.dataset.itemLabel = preservedData?.psychosocial_custom_name || `心理社會治療項目 ${index}`;

        const body = document.createElement('div');
        body.className = 'space-y-4';

        body.appendChild(createFieldGroup('項目名稱', createFieldText('psychosocial_custom_name', detailPrefix, '請輸入項目名稱', 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none')));
        body.appendChild(createPsychosocialCourseBlock(detailPrefix));
        body.appendChild(buildTemplateTextareaGroup('補充說明', 'note', detailPrefix, '請補充此項目的實際執行方式'));

        const deleteRowBtn = createCardDeleteButton(function () {
            const parent = card.parentElement;
            if (!parent) return;
            if (parent.querySelectorAll('.treatment-detail-panel').length > 1) {
                card.remove();
            } else {
                alert('至少需保留一筆心理社會治療項目。');
            }
        });
        body.insertBefore(deleteRowBtn, body.firstChild);

        card.appendChild(body);
        if (preservedData) {
            const nameInput = card.querySelector('[data-field="psychosocial_custom_name"]');
            if (nameInput) nameInput.value = preservedData.psychosocial_custom_name || '';
            if (preservedData.course_mode) {
                const modeInput = card.querySelector(`input[type="radio"][data-field="course_mode"][value="${preservedData.course_mode}"]`);
                if (modeInput) {
                    modeInput.checked = true;
                    modeInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            }
            ['course_duration_value', 'course_duration_unit', 'frequency_count', 'frequency_period_unit', 'minutes_per_session', 'note'].forEach(function (fieldName) {
                const field = card.querySelector(`[data-field="${fieldName}"]`);
                if (field && preservedData[fieldName]) {
                    field.value = preservedData[fieldName];
                }
            });
        }
        return card;
    }

    function collectCheckedFieldValues(fieldName, scope) {
        return Array.from((scope || document).querySelectorAll(`input[type="checkbox"][data-field="${fieldName}"]:checked`))
            .map(function (input) {
                return input.value || '';
            })
            .filter(Boolean);
    }

    function createPsychosocialCustomList(rowPrefix, preservedItems) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-4';
        wrap.dataset.psychosocialCustomList = '1';

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addBtn.textContent = '+ 新增心理社會治療項目';
        wrap.appendChild(addBtn);

        const list = document.createElement('div');
        list.className = 'space-y-4';
        wrap.appendChild(list);

        let itemCount = 0;
        const addItem = function (data) {
            itemCount += 1;
            list.appendChild(createPsychosocialCustomItemCard(rowPrefix, itemCount, data || null));
        };

        addBtn.addEventListener('click', function () {
            addItem(null);
        });

        (preservedItems && preservedItems.length ? preservedItems : [null]).forEach(function (item) {
            addItem(item);
        });

        return wrap;
    }

    function createProcessFrequencyBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-4';

        const modeGroup = createFieldGroup('期程執行頻率', createFieldSelect('dose_mode', rowPrefix, [
            { value: '', text: '-- 請選擇 --', selected: true },
            { value: 'once', text: '一次性' },
            { value: 'repeated', text: '重複性' }
        ], 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
        wrap.appendChild(modeGroup);

        const note = document.createElement('div');
        note.className = 'text-xs text-slate-500 bg-slate-50 border border-dashed border-slate-300 rounded-lg px-3 py-2';
        note.textContent = '若包含多個工具或步驟，則以該階段「主要且每次必做」的項目頻率，作為整個流程執行頻率的填寫依據。';
        wrap.appendChild(note);

        const oncePanel = document.createElement('div');
        oncePanel.className = 'dose-panel space-y-2 hidden';
        oncePanel.dataset.dosePanel = 'once';
        oncePanel.appendChild(createFieldGroup('單次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('single_minutes', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));
        wrap.appendChild(oncePanel);

        const repeatedPanel = document.createElement('div');
        repeatedPanel.className = 'dose-panel space-y-3 hidden';
        repeatedPanel.dataset.dosePanel = 'repeated';
        repeatedPanel.appendChild(createFieldGroup('期程長度', (function () {
            const line = document.createElement('div');
            line.className = 'compact-frequency';
            line.appendChild(createFieldNumber('duration_value', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('duration_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })()));
        repeatedPanel.appendChild(createFieldGroup('期程內總次數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('total_count', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })()));
        repeatedPanel.appendChild(createFieldGroup('每次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('minutes_per_session', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));
        wrap.appendChild(repeatedPanel);

        const select = modeGroup.querySelector('select[data-field="dose_mode"]');
        const updateVisibility = function () {
            const value = select?.value || '';
            oncePanel.classList.toggle('hidden', value !== 'once');
            repeatedPanel.classList.toggle('hidden', value !== 'repeated');
        };
        if (select) {
            select.addEventListener('change', updateVisibility);
        }
        updateVisibility();

        return wrap;
    }

    function readCheckedValues(scope, fieldName) {
        return Array.from(scope.querySelectorAll(`[data-field="${fieldName}"]`))
            .filter(function (field) {
                return field.type === 'checkbox' && field.checked;
            })
            .map(function (field) {
                return field.value || '';
            })
            .filter(Boolean);
    }

    function readCheckedOtherText(scope, fieldName) {
        const otherInput = scope.querySelector(`[data-other-for="${fieldName}"]`);
        return otherInput?.value || '';
    }

    function readRadioValue(scope, fieldName) {
        const fields = Array.from(scope.querySelectorAll(`[data-field="${fieldName}"]`));
        const checked = fields.find(function (field) {
            return field.type === 'radio' && field.checked;
        });
        return checked ? checked.value || '' : '';
    }

    function createDottedNoteBox(text) {
        const box = document.createElement('div');
        box.className = 'text-xs text-slate-500 border border-dashed border-slate-300 rounded-lg bg-white px-3 py-2';
        box.textContent = text;
        return box;
    }

    function createAssessmentDoseBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';

        wrap.appendChild(createFieldGroup('評估總次數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('total_count', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })()));

        wrap.appendChild(createFieldGroup('每次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('minutes_per_session', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));

        wrap.appendChild(createFieldGroup('追蹤期間（選填）', createFieldText('followup_interval', rowPrefix, '例如 3 個月', 'inline-input w-40 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none')));

        return wrap;
    }

    function createBriefDoseBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';

        wrap.appendChild(createFieldGroup('整個方案期程內預計總次數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('total_count', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })()));

        wrap.appendChild(createFieldGroup('每次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('minutes_per_session', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));

        return wrap;
    }

    function createTreatmentDoseBlock(rowPrefix, config) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';

        if (config?.doseType === 'medication') {
            wrap.appendChild(createFieldGroup('主要提供方式', createCompactChoiceGroup({
                type: 'radio',
                field: 'medication_delivery_mode',
                rowPrefix,
                options: [
                    { text: '門診追蹤', value: '門診追蹤' },
                    { text: '院內給藥', value: '院內給藥' },
                    { text: '藥物管理', value: '藥物管理' },
                    { text: '其他', value: '其他', other: true }
                ],
                otherField: 'medication_delivery_mode_other',
                otherPlaceholder: '請輸入其他內容'
            })));

            wrap.appendChild(createFieldGroup('平均回診或追蹤間隔', createCompactChoiceGroup({
                type: 'radio',
                field: 'followup_interval',
                rowPrefix,
                options: [
                    { text: '每週', value: '每週' },
                    { text: '雙週', value: '雙週' },
                    { text: '每月', value: '每月' },
                    { text: '依病況', value: '依病況' }
                ]
            })));

            wrap.appendChild(createFieldGroup('預估追蹤期間（月）', (function () {
                const line = document.createElement('div');
                line.className = 'flex flex-wrap items-center gap-2';
                line.appendChild(createFieldNumber('duration_months', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                line.appendChild(document.createTextNode('月'));
                return line;
            })()));

            wrap.appendChild(createFieldGroup('是否合併心理社會介入', createCompactChoiceGroup({
                type: 'radio',
                field: 'combined_psychosocial_intervention',
                rowPrefix,
                options: [
                    { text: '是', value: '是' },
                    { text: '否', value: '否' }
                ]
            })));

            return wrap;
        }

        wrap.appendChild(createFieldGroup('整體療程週數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('duration_weeks', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('週'));
            return line;
        })()));

        wrap.appendChild(createFieldGroup('整個療程預計總次數', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('total_count', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('次'));
            return line;
        })()));

        wrap.appendChild(createFieldGroup('每次平均時間（分鐘）', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('minutes_per_session', rowPrefix, '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(document.createTextNode('分鐘'));
            return line;
        })()));

        return wrap;
    }

    function createSimpleNoteTemplateBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-4';

        wrap.appendChild(createMultiSelectFieldGroup('無法歸類原因', 'unavailable_reason', rowPrefix, [
            '既有分類不足',
            '方案尚未定型',
            '資料院內無法取得',
            '非直接服務方案',
            '其他'
        ], {
            otherField: 'unavailable_reason_other'
        }));

        wrap.appendChild(createSingleSelectFieldGroup('最接近哪一類', 'closest_category', rowPrefix, [
            '篩檢／評估',
            '短期介入／衛教／轉介',
            '專業治療',
            '復健／支持',
            '無法判定'
        ]));

        wrap.appendChild(createFieldGroup('簡要說明', createFieldTextarea('note', rowPrefix, '請簡要說明原因')));
        return wrap;
    }

    function createReferralBlock(rowPrefix) {
        const wrap = document.createElement('div');
        wrap.className = 'space-y-3';

        wrap.appendChild(createMultiSelectFieldGroup('轉介去向', 'referral_destinations', rowPrefix, [
            '精神科',
            '成癮門診',
            '感染科',
            '肝膽腸胃科',
            '社福',
            '職業重建',
            '社區資源',
            '司法／保護管束合作單位',
            '其他'
        ], {
            otherField: 'referral_destinations_other'
        }));

        wrap.appendChild(createSelectFieldGroup('是否追蹤到實際到達服務端', 'reached_service_endpoint', rowPrefix, [
            { value: '是', text: '是' },
            { value: '否', text: '否' },
            { value: '不一定', text: '不一定' },
            { value: '不適用', text: '不適用' }
        ], '-- 請選擇 --'));

        return wrap;
    }

    function buildSimpleNoteSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);
        sectionDiv.setAttribute('data-simple-section', '1');

        const noteRow = document.createElement('div');
        noteRow.className = 'mt-2 rounded-lg border border-gray-200 bg-gray-50 p-4';

        const noteLabel = document.createElement('label');
        noteLabel.className = 'block text-sm font-semibold text-gray-700 mb-2';
        noteLabel.textContent = config.noteLabel || '說明';
        noteRow.appendChild(noteLabel);

        const textarea = createFieldTextarea('note', id, config.notePlaceholder || '具體施行模式說明');
        noteRow.appendChild(textarea);
        sectionDiv.appendChild(noteRow);

        insertSectionByOrder(sectionDiv, id);
        bindAutoResizeInScope(sectionDiv);
    }

    function buildLegacySection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        if (config.hasDuration) {
            const durationDiv = document.createElement('div');
            durationDiv.className = 'inline-flex flex-nowrap items-center gap-1.5 mb-4 text-sm bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100';

            const durationLabel = document.createElement('span');
            durationLabel.className = 'font-bold text-gray-700 whitespace-nowrap';
            durationLabel.textContent = config.durationText;
            durationDiv.appendChild(durationLabel);

            const durationInput = document.createElement('input');
            durationInput.type = 'number';
            durationInput.placeholder = '0';
            durationInput.className = 'inline-input w-20 border border-gray-300 rounded px-1.5 py-0.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white';
            durationInput.min = '0';
            durationDiv.appendChild(durationInput);

            const durationSelect = document.createElement('select');
            durationSelect.className = 'inline-select border border-gray-300 rounded px-1 py-0.5 text-sm bg-white font-medium w-16 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer';
            ['日', '週'].forEach(unit => {
                const opt = document.createElement('option');
                opt.value = unit;
                opt.textContent = unit;
                durationSelect.appendChild(opt);
            });
            durationDiv.appendChild(durationSelect);

            sectionDiv.appendChild(durationDiv);
        } else {
            const screeningInfoDiv = document.createElement('div');
            if (config.isSpecial3c) {
                screeningInfoDiv.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
                screeningInfoDiv.textContent = '💡 提示：本項屬「生理共病之專業治療」，請依據實務填寫內容並於說明欄補充。';
            } else {
                screeningInfoDiv.className = 'mb-4 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-100';
                screeningInfoDiv.textContent = '💡 提示：本項定位屬「篩檢與即時評估」性質，以隨門診/外展施測完成為主，故無須填寫整體療程總期程。';
            }
            sectionDiv.appendChild(screeningInfoDiv);
        }

        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'overflow-x-auto mt-4 w-full';

        const table = document.createElement('table');
        table.className = 'w-full text-left border-collapse border border-gray-300 table-fixed text-sm';

        const thead = document.createElement('thead');
        thead.className = 'bg-gray-100 border-b border-gray-300';
        const headerRow = document.createElement('tr');

        const columnConfigs = config.isSpecial3c ? [
            { text: '療程名稱', width: '25%' },
            { text: '說明', width: '69%' },
            { text: '操作', width: '6%' }
        ] : [
            { text: '流程名稱', width: '25%' },
            { text: '介入型態', width: '10%' },
            { text: `${config.labelB}`, width: '10%' },
            { text: `${config.labelC}`, width: '10%' },
            { text: '說明', width: '39%' },
            { text: '操作', width: '6%' }
        ];

        columnConfigs.forEach(function (col) {
            const th = document.createElement('th');
            th.className = 'border border-gray-300 p-2.5 font-bold text-gray-700 text-xs tracking-wider';
            th.style.width = col.width;
            th.textContent = col.text;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        tbody.id = `tbody-${id}`;
        tbody.className = 'bg-white divider-y divider-gray-200';
        table.appendChild(tbody);
        tableWrapper.appendChild(table);
        sectionDiv.appendChild(tableWrapper);

        const flagDiv = document.createElement('div');
        flagDiv.id = `flag-box-${id}`;
        flagDiv.className = 'mt-3 text-red-600 bg-red-50 border border-red-200 p-3 rounded text-xs font-bold hidden leading-relaxed shadow-sm';
        sectionDiv.appendChild(flagDiv);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-3 flex justify-start items-center';

        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        addRowBtn.addEventListener('click', () => createTableRow(id, config));
        actionRow.appendChild(addRowBtn);

        sectionDiv.appendChild(actionRow);

        createTableRow(id, config);
        insertSectionByOrder(sectionDiv, id);
    }

    function renderAssessmentSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-100';
        info.textContent = '請依據本方案實際執行內容填寫篩檢/評估項目，並可針對「其他」補充說明。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('service-row-card');
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.service-row-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                    refreshContractedProcessSelects();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';

            if (config.showTargets) {
                body.appendChild(createFieldGroup('A. 篩檢標的', createServiceOptions({
                    type: 'checkbox',
                    field: 'screening_targets',
                    rowPrefix,
                    options: config.targetOptions,
                    otherField: 'screening_targets_other',
                    otherPlaceholder: '請輸入其他內容'
                })));
            }

            body.appendChild(createFieldGroup('1. 執行場域', createServiceOptions({
                type: 'checkbox',
                field: 'execution_sites',
                rowPrefix,
                options: [
                    { text: '住院-精神/成癮科', value: '住院-精神/成癮科' },
                    { text: '住院-其他科', value: '住院-其他科' },
                    { text: '門診-精神/成癮科', value: '門診-精神/成癮科' },
                    { text: '門診-其他科', value: '門診-其他科' },
                    { text: '急診', value: '急診' },
                    { text: '社區-社福機構/診所', value: '社區-社福機構/診所' },
                    { text: '社區-潛藏族群', value: '社區-潛藏族群' },
                    { text: '矯正機關', value: '矯正機關' },
                    { text: '其他', value: '其他', other: true }
                ],
                otherField: 'execution_sites_other',
                otherPlaceholder: '請輸入其他內容'
            })));

            body.appendChild(createFieldGroup('2. 期程執行頻率', createFrequencyControl(rowPrefix, 'frequency')));

            body.appendChild(createFieldGroup('3. 執行方式', createServiceOptions({
                type: 'checkbox',
                field: 'execution_methods',
                rowPrefix,
                options: [
                    { text: '自填問卷', value: '自填問卷' },
                    { text: '會談', value: '會談' },
                    { text: '檢體檢驗', value: '檢體檢驗' },
                    { text: '儀器施測', value: '儀器施測' },
                    { text: '其他', value: '其他', other: true }
                ],
                otherField: 'execution_methods_other',
                otherPlaceholder: '請輸入其他內容'
            })));

            body.appendChild(createFieldGroup('E. 說明', createFieldTextarea('note', rowPrefix, config.notePlaceholder || '具體施行模式說明')));

            card.appendChild(body);
            cardList.appendChild(card);
            refreshContractedProcessSelects();
            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderBriefSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100';
        info.textContent = '請依方案內容填寫短期介入、衛教或轉介的執行安排。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('service-row-card');
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.service-row-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                    refreshContractedProcessSelects();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';

            body.appendChild(createFieldGroup('A. 服務項目', createCompactChoiceGroup({
                type: 'radio',
                field: 'service_item',
                rowPrefix,
                options: [
                    { text: '短期介入', value: '短期介入' },
                    { text: '衛教', value: '衛教' },
                    { text: '轉介', value: '轉介' }
                ]
            })));

            body.appendChild(createFieldGroup('1. 執行場域', createServiceOptions({
                type: 'checkbox',
                field: 'execution_sites',
                rowPrefix,
                options: [
                    { text: '住院-精神/成癮科', value: '住院-精神/成癮科' },
                    { text: '住院-其他科', value: '住院-其他科' },
                    { text: '門診-精神/成癮科', value: '門診-精神/成癮科' },
                    { text: '門診-其他科', value: '門診-其他科' },
                    { text: '急診', value: '急診' },
                    { text: '社區-社福機構/診所', value: '社區-社福機構/診所' },
                    { text: '社區-潛藏族群', value: '社區-潛藏族群' },
                    { text: '矯正機關', value: '矯正機關' },
                    { text: '其他', value: '其他', other: true }
                ],
                otherField: 'execution_sites_other',
                otherPlaceholder: '請輸入其他內容'
            })));

            body.appendChild(createFieldGroup('2. 期程執行頻率', createFrequencyControl(rowPrefix, 'frequency')));

            body.appendChild(createFieldGroup('3. 執行方式', createServiceOptions({
                type: 'checkbox',
                field: 'execution_methods',
                rowPrefix,
                options: [
                    { text: '個別', value: '個別' },
                    { text: '團體', value: '團體' },
                    { text: '家屬', value: '家屬' },
                    { text: '其他', value: '其他', other: true }
                ],
                otherField: 'execution_methods_other',
                otherPlaceholder: '請輸入其他內容'
            })));

            body.appendChild(createFieldGroup('E. 說明', createFieldTextarea('note', rowPrefix, config.notePlaceholder || '具體施行模式說明')));

            card.appendChild(body);
            cardList.appendChild(card);
            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderProfessional3aSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
        info.textContent = '請依方案實際執行內容，分別填寫生物治療與心理社會治療安排。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-6 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('treatment-card');
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.treatment-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                    refreshContractedProcessSelects();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';

            body.appendChild(createFieldGroup('執行場域', createCompactChoiceGroup({
                type: 'radio',
                field: 'service_setting',
                rowPrefix,
                options: [
                    { text: '全日住院', value: '全日住院' },
                    { text: '居住照護', value: '居住照護' },
                    { text: '日間留院', value: '日間留院' },
                    { text: '門診', value: '門診' },
                    { text: '其他', value: '其他', other: true }
                ]
            })));

            const modeGroup = createFieldGroup('執行模式', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'treatment_modes',
                rowPrefix,
                options: [
                    { text: '生物治療', value: '生物治療' },
                    { text: '心理社會治療', value: '心理社會治療' }
                ]
            }));
            body.appendChild(modeGroup);

            const modeInputs = Array.from(modeGroup.querySelectorAll('input[type="checkbox"]'));
            const bioModeInput = modeInputs.find(function (input) {
                return input.value === '生物治療';
            });
            const psyModeInput = modeInputs.find(function (input) {
                return input.value === '心理社會治療';
            });

            const modulesWrap = document.createElement('div');
            modulesWrap.className = 'space-y-4 hidden';
            body.appendChild(modulesWrap);

            const bioModule = createModuleCard('生物治療模組');
            const bioModuleBody = document.createElement('div');
            bioModuleBody.className = 'space-y-4';

            const bioModeGroup = createFieldGroup('治療類型', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'bio_treatment_modes',
                rowPrefix,
                options: [
                    { text: '藥物治療', value: '藥物治療' },
                    { text: '非藥物治療', value: '非藥物治療' }
                ]
            }));
            bioModuleBody.appendChild(bioModeGroup);

            const bioModeInputs = Array.from(bioModeGroup.querySelectorAll('input[type="checkbox"]'));
            const drugModeInput = bioModeInputs.find(function (input) {
                return input.value === '藥物治療';
            });
            const nonDrugModeInput = bioModeInputs.find(function (input) {
                return input.value === '非藥物治療';
            });

            const bioDetailWrap = document.createElement('div');
            bioDetailWrap.className = 'space-y-4 hidden';

            const drugPanel = createFieldGroup('藥物治療', (function () {
                const wrap = document.createElement('div');
                wrap.className = 'space-y-3';
                wrap.appendChild(createFieldGroup('藥物治療期程', (function () {
                    const periodWrap = document.createElement('div');
                    periodWrap.className = 'compact-frequency';
                    periodWrap.appendChild(document.createTextNode('每'));
                    periodWrap.appendChild(createFieldNumber('medication_period_value', rowPrefix, '0', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                    periodWrap.appendChild(createFieldSelect('medication_period_unit', rowPrefix, [
                        { value: '日', text: '日' },
                        { value: '週', text: '週' },
                        { value: '月', text: '月' },
                        { value: '不定期程', text: '不定期程' }
                    ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                    periodWrap.appendChild(createFieldNumber('medication_period_times', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                    periodWrap.appendChild(document.createTextNode('次'));
                    return periodWrap;
                })()));
                wrap.appendChild(createFieldGroup('藥物種類', createCompactChoiceGroup({
                    type: 'checkbox',
                    field: 'medication_types',
                    rowPrefix,
                    options: [
                        { text: '美沙冬', value: '美沙冬' },
                        { text: '丁基原啡因', value: '丁基原啡因' },
                        { text: '拿萃松（Naltrexone）', value: '拿萃松（Naltrexone）' },
                        { text: '阿坎酸（Acamprosate）', value: '阿坎酸（Acamprosate）' },
                        { text: '二硫倫（Disulfiram）', value: '二硫倫（Disulfiram）' },
                        { text: '尼古丁替代治療', value: '尼古丁替代治療' },
                        { text: '伐尼克蘭（Varenicline）', value: '伐尼克蘭（Varenicline）' },
                        { text: '苯二氮平類鎮定劑（BZD）', value: '苯二氮平類鎮定劑（BZD）' },
                        { text: '其他藥物', value: '其他藥物', other: true }
                    ],
                    otherField: 'medication_types_other',
                    otherPlaceholder: '請輸入其他藥物'
                })));
                return wrap;
            })());
            bioDetailWrap.appendChild(drugPanel);

            const nonDrugPanel = createFieldGroup('非藥物治療', (function () {
                const wrap = document.createElement('div');
                wrap.className = 'space-y-3';
                wrap.appendChild(createFieldGroup('非藥物治療種類', createCompactChoiceGroup({
                    type: 'radio',
                    field: 'non_drug_type',
                    rowPrefix,
                    options: [
                        { text: 'rTMS（重複經顱磁刺激）', value: 'rTMS（重複經顱磁刺激）' },
                        { text: '其他神經調控技術', value: '其他神經調控技術', other: true },
                        { text: '其他生物療法', value: '其他生物療法', other: true }
                    ],
                    otherField: 'non_drug_type_other',
                    otherPlaceholder: '請輸入其他內容'
                })));
                wrap.appendChild(createFieldGroup('非藥物治療期程執行頻率', createFrequencyControl(rowPrefix, 'non_drug_frequency')));
                wrap.appendChild(createFieldGroup('非藥物治療說明', createFieldTextarea('non_drug_note', rowPrefix, '非藥物治療說明')));
                return wrap;
            })());
            bioDetailWrap.appendChild(nonDrugPanel);
            bioModuleBody.appendChild(bioDetailWrap);
            bioModule.appendChild(bioModuleBody);

            const psyModule = createModuleCard('心理社會治療模組');
            const psyModuleBody = document.createElement('div');
            psyModuleBody.className = 'space-y-4';
            psyModuleBody.appendChild(createFieldGroup('治療類型', createCompactChoiceGroup({
                type: 'radio',
                field: 'psychosocial_type',
                rowPrefix,
                options: [
                    { text: '個別心理治療', value: '個別心理治療' },
                    { text: '團體心理治療', value: '團體心理治療' },
                    { text: '家族治療', value: '家族治療' },
                    { text: '其他', value: '其他', other: true },
                    { text: '無', value: '無' }
                ],
                otherField: 'psychosocial_type_other',
                otherPlaceholder: '請輸入其他內容'
            })));
            psyModuleBody.appendChild(createFieldGroup('期程執行頻率', createFrequencyControl(rowPrefix, 'psychosocial_frequency')));
            psyModuleBody.appendChild(createFieldGroup('單次時間', (function () {
                const timeWrap = document.createElement('div');
                timeWrap.className = 'flex flex-wrap items-center gap-2';
                timeWrap.appendChild(createFieldNumber('psychosocial_single_minutes', rowPrefix, '0', 'w-16 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                timeWrap.appendChild(document.createTextNode('分鐘'));
                return timeWrap;
            })()));
            psyModuleBody.appendChild(createFieldGroup('治療取向', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'treatment_orientations',
                rowPrefix,
                options: [
                    { text: 'DBT', value: 'DBT' },
                    { text: '正念', value: '正念' },
                    { text: '認知行為治療（CBT）', value: '認知行為治療（CBT）' },
                    { text: '權變管理（CM）', value: '權變管理（CM）' },
                    { text: '社群強化法（CRA）', value: '社群強化法（CRA）' },
                    { text: '動機式訪談（MI）', value: '動機式訪談（MI）' },
                    { text: '動機強化治療（MET）', value: '動機強化治療（MET）' },
                    { text: '其他', value: '其他', other: true }
                ],
                otherField: 'treatment_orientations_other',
                otherPlaceholder: '請輸入其他內容'
            })));
            psyModuleBody.appendChild(createFieldGroup('心理社會治療說明', createFieldTextarea('psychosocial_note', rowPrefix, '心理社會治療說明')));
            psyModule.appendChild(psyModuleBody);

            modulesWrap.appendChild(bioModule);
            modulesWrap.appendChild(psyModule);
            body.appendChild(createFieldGroup('整體說明', createFieldTextarea('note', rowPrefix, config.notePlaceholder || '具體施行模式說明')));
            body.appendChild(modulesWrap);

            card.appendChild(body);
            cardList.appendChild(card);
            refreshContractedProcessSelects();

            const updateModeVisibility = function () {
                const showBio = !!bioModeInput?.checked;
                const showPsy = !!psyModeInput?.checked;
                modulesWrap.classList.toggle('hidden', !(showBio || showPsy));
                bioModule.classList.toggle('hidden', !showBio);
                psyModule.classList.toggle('hidden', !showPsy);
            };

            const updateBioDetailVisibility = function () {
                const showBioDetail = !!(drugModeInput?.checked || nonDrugModeInput?.checked);
                bioDetailWrap.classList.toggle('hidden', !showBioDetail);
                drugPanel.classList.toggle('hidden', !drugModeInput?.checked);
                nonDrugPanel.classList.toggle('hidden', !nonDrugModeInput?.checked);
            };

            modeInputs.forEach(function (input) {
                input.addEventListener('change', updateModeVisibility);
            });
            bioModeInputs.forEach(function (input) {
                input.addEventListener('change', updateBioDetailVisibility);
            });

            updateModeVisibility();
            updateBioDetailVisibility();

            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderAssessmentTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-100';
        info.textContent = '請依序填寫執行標的、執行方式、執行場域、期程執行頻率與補充說明。本區主要盤點服務流程與安排；量表、檢驗、監測工具請於第五區塊填寫，避免重複填報。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('service-row-card');
            card.dataset.templateKind = 'assessment';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.service-row-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';

            body.appendChild(createMultiSelectFieldGroup(config.targetLabel || '處理主題', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            body.appendChild(createMultiSelectFieldGroup(config.methodLabel || '執行方式', 'execution_methods', rowPrefix, config.methodOptions || [], { otherField: 'execution_methods_other' }));
            if ((config.settingOptions || []).length > 0) {
                body.appendChild(createSingleSelectFieldGroup('執行場域', 'execution_sites', rowPrefix, config.settingOptions || [], {
                    otherField: 'execution_sites_other'
                }));
            }
            body.appendChild(createProcessFrequencyBlock(rowPrefix));
            body.appendChild(buildTemplateTextareaGroup('補充說明', 'note', rowPrefix, config.notePlaceholder || '具體施行模式說明'));

            card.appendChild(body);
            cardList.appendChild(card);
            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderBriefTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-100';
        info.textContent = '請依序填寫服務項目、執行標的、執行方式、執行場域與期程執行頻率；若屬轉介類服務，再補充轉介資訊。本區主要盤點服務流程與安排；量表、檢驗、監測工具請於第五區塊填寫，避免重複填報。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('service-row-card');
            card.dataset.templateKind = 'brief';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.service-row-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';
            body.appendChild(createFieldGroup(config.itemLabel || '服務項目', createFieldSelect('service_item', rowPrefix, [
                { value: '', text: '-- 請選擇 --', selected: true }
            ].concat(normalizeTemplateOptions(config.itemOptions || [])), 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none')));
            body.appendChild(createMultiSelectFieldGroup(config.targetLabel || '處理主題', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            body.appendChild(createMultiSelectFieldGroup(config.methodLabel || '執行方式', 'execution_methods', rowPrefix, config.methodOptions || [], { otherField: 'execution_methods_other' }));
            if ((config.settingOptions || []).length > 0) {
                body.appendChild(createSingleSelectFieldGroup('執行場域', 'execution_sites', rowPrefix, config.settingOptions || [], {
                    otherField: 'execution_sites_other'
                }));
            }
            body.appendChild(createProcessFrequencyBlock(rowPrefix));

            const referralPanel = createFieldGroup('轉介資訊', createReferralBlock(rowPrefix));
            referralPanel.classList.add('hidden');
            body.appendChild(referralPanel);
            body.appendChild(buildTemplateTextareaGroup('補充說明', 'note', rowPrefix, config.notePlaceholder || '具體施行模式說明'));

            card.appendChild(body);
            cardList.appendChild(card);
            refreshContractedProcessSelects();

            const serviceSelect = card.querySelector('select[data-field="service_item"]');
            const updateReferralVisibility = function () {
                const value = (serviceSelect?.value || '').trim();
                const showReferral = value === '轉介';
                referralPanel.classList.toggle('hidden', !showReferral);
            };
            if (serviceSelect) {
                serviceSelect.addEventListener('change', updateReferralVisibility);
            }
            updateReferralVisibility();

            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function createTreatmentDetailPanel(rowPrefix, itemKey, options) {
        const detailPrefix = `${rowPrefix}_${itemKey}`;
        const panel = createModuleCard(options.title || itemKey);
        panel.classList.add('treatment-detail-panel');
        panel.dataset.detailGroup = options.group || '';
        panel.dataset.detailKey = itemKey;
        panel.dataset.detailPrefix = detailPrefix;
        panel.dataset.toggleField = options.toggleField || '';
        panel.dataset.itemLabel = options.title || itemKey;

        const detailBody = document.createElement('div');
        detailBody.className = 'space-y-4 hidden';

        if (!options.hideToggle) {
            const toggleRow = createCompactChoiceGroup({
                type: 'checkbox',
                field: options.toggleField,
                rowPrefix,
                options: [
                    { text: '啟用此項目', value: options.title || itemKey }
                ]
            });
            const toggleInput = toggleRow.querySelector('input[type="checkbox"]');
            const toggleWrap = document.createElement('div');
            toggleWrap.className = 'mb-3';
            toggleWrap.appendChild(toggleRow);
            panel.appendChild(toggleWrap);

            toggleInput.addEventListener('change', function () {
                detailBody.classList.toggle('hidden', !toggleInput.checked);
            });
        } else {
            detailBody.classList.remove('hidden');
        }

        if (options.otherFieldName) {
            const otherInput = createFieldText(
                options.otherFieldName,
                detailPrefix,
                options.otherPlaceholder || '請輸入其他內容',
                'inline-input w-56 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
            );
            otherInput.dataset.detailOther = '1';
            detailBody.appendChild(createFieldGroup(
                options.otherFieldLabel || '其他名稱',
                otherInput
            ));
        }

        if (options.includeFormats) {
            detailBody.appendChild(createMultiSelectFieldGroup('服務形式', 'psychosocial_formats', detailPrefix, [
                '個別',
                '團體',
                '家庭',
                '其他'
            ], { otherField: 'psychosocial_formats_other' }));
        }

        detailBody.appendChild(createUnifiedDoseBlock(detailPrefix));
        detailBody.appendChild(buildTemplateTextareaGroup('項目說明', 'note', detailPrefix, options.notePlaceholder || '請說明此項目的實際執行方式'));

        panel.appendChild(detailBody);
        return panel;
    }

    function createMedicationSingleChoicePanel(rowPrefix) {
        const detailPrefix = `${rowPrefix}_primary_medication`;
        const panel = createModuleCard('藥物治療');
        panel.classList.add('treatment-detail-panel');
        panel.dataset.detailGroup = 'biological-medication';
        panel.dataset.detailKey = 'primary_medication';
        panel.dataset.detailPrefix = detailPrefix;
        panel.dataset.itemLabel = '藥物治療';

        const detailBody = document.createElement('div');
        detailBody.className = 'space-y-4';

        const note = document.createElement('div');
        note.className = 'text-xs text-slate-500';
        note.textContent = '請以本方案主要使用的藥物為準';
        detailBody.appendChild(note);

        detailBody.appendChild(createFieldGroup('藥物種類', createSelectWithOther('medication_type', detailPrefix, [
            '美沙冬',
            '丁基原啡因',
            '拿萃松（Naltrexone）',
            '阿坎酸（Acamprosate）',
            '二硫倫（Disulfiram）',
            '尼古丁替代治療',
            '伐尼克蘭（Varenicline）',
            '苯二氮平類鎮定劑（BZD）',
            '其他藥物'
        ], '-- 請選擇 --', 'medication_type_other')));
        detailBody.appendChild(createUnifiedDoseBlock(detailPrefix));
        detailBody.appendChild(buildTemplateTextareaGroup('項目說明', 'note', detailPrefix, '請說明此藥物治療之實際執行方式'));

        panel.appendChild(detailBody);
        return panel;
    }

    function renderTreatment3aTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
        info.textContent = '請先選擇執行標的、執行場域與執行模式，再依需要展開各細項。本區主要盤點服務流程與安排；量表、檢驗、監測工具請於第五區塊填寫，避免重複填報。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('treatment-card');
            card.dataset.templateKind = 'treatment';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.treatment-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';
            body.appendChild(createMultiSelectFieldGroup('執行標的', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            body.appendChild(createExecutionSitesFieldGroup(rowPrefix));

            const modeGroup = createFieldGroup('執行模式', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'treatment_modes',
                rowPrefix,
                options: [
                    { text: '生理治療', value: '生理治療' },
                    { text: '心理社會治療', value: '心理社會治療' }
                ]
            }));
            body.appendChild(modeGroup);

            const bioSection = createFieldGroup('生理治療區塊', document.createElement('div'));
            bioSection.classList.add('hidden');
            bioSection.dataset.section4Role = 'bio-section';
            const bioWrap = document.createElement('div');
            bioWrap.className = 'space-y-4';

            const bioTypeGroup = createFieldGroup('生理治療類型', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'bio_treatment_types',
                rowPrefix,
                options: [
                    { text: '藥物治療', value: '藥物治療' },
                    { text: '非藥物治療', value: '非藥物治療' }
                ]
            }));
            bioWrap.appendChild(bioTypeGroup);

            const medicationPanel = createMedicationTreatmentCard(rowPrefix);
            medicationPanel.classList.add('hidden');
            bioWrap.appendChild(medicationPanel);

            const nonMedicationItems = [
                { key: 'rtms', label: 'rTMS（重複經顱磁刺激）' },
                {
                    key: 'other_neuromodulation',
                    label: '其他神經調控技術',
                    extra: {
                        otherFieldName: 'other_neuromodulation_other',
                        otherFieldLabel: '其他神經調控技術名稱',
                        otherPlaceholder: '請輸入其他神經調控技術名稱'
                    }
                },
                {
                    key: 'other_biotherapy',
                    label: '其他生物療法',
                    extra: {
                        otherFieldName: 'other_biotherapy_other',
                        otherFieldLabel: '其他生物療法名稱',
                        otherPlaceholder: '請輸入其他生物療法名稱'
                    }
                }
            ];
            const nonMedicationSelection = createFieldGroup('本方案使用哪些治療？', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'non_medication_items',
                rowPrefix,
                options: nonMedicationItems.map(function (item) {
                    return { text: item.label, value: item.key };
                })
            }));
            const nonMedicationArea = document.createElement('div');
            nonMedicationArea.className = 'hidden space-y-4';
            nonMedicationArea.appendChild(nonMedicationSelection);

            const nonMedicationCardList = document.createElement('div');
            nonMedicationCardList.className = 'hidden space-y-4';
            nonMedicationArea.appendChild(nonMedicationCardList);
            bioWrap.appendChild(nonMedicationArea);

            const renderNonMedicationCards = function () {
                const preserved = {};
                Array.from(nonMedicationCardList.querySelectorAll('.treatment-detail-panel')).forEach(function (card) {
                    preserved[card.dataset.detailKey] = {
                        course_mode: collectFieldValueByScope(card, 'course_mode'),
                        course_duration_value: collectFieldValueByScope(card, 'course_duration_value'),
                        course_duration_unit: collectFieldValueByScope(card, 'course_duration_unit'),
                        course_total_count: collectFieldValueByScope(card, 'course_total_count'),
                        frequency_period_value: collectFieldValueByScope(card, 'frequency_period_value'),
                        frequency_period_unit: collectFieldValueByScope(card, 'frequency_period_unit'),
                        frequency_count: collectFieldValueByScope(card, 'frequency_count'),
                        note: collectFieldValueByScope(card, 'note')
                    };
                    nonMedicationItems.forEach(function (item) {
                        if (item.extra && item.extra.otherFieldName) {
                            preserved[card.dataset.detailKey][item.extra.otherFieldName] = (card.querySelector(`[data-field="${item.extra.otherFieldName}"]`) || {}).value || '';
                        }
                    });
                });

                clearNode(nonMedicationCardList);

                nonMedicationItems.forEach(function (item) {
                    const checkbox = nonMedicationSelection.querySelector(`input[type="checkbox"][value="${item.key}"]`);
                    if (!checkbox || !checkbox.checked) return;
                    const card = createNonMedicationTreatmentCard(rowPrefix, item.key, item.label, Object.assign({
                        group: 'biological-non-medication',
                        notePlaceholder: '請說明此項目的實際執行方式'
                    }, item.extra || {}));
                    const saved = preserved[item.key] || {};
                    if (saved.course_mode) {
                        const modeInput = card.querySelector(`input[type="radio"][data-field="course_mode"][value="${saved.course_mode}"]`);
                        if (modeInput) {
                            modeInput.checked = true;
                            modeInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                    ['course_duration_value', 'course_duration_unit', 'course_total_count', 'frequency_period_value', 'frequency_period_unit', 'frequency_count', 'note'].forEach(function (fieldName) {
                        const value = saved[fieldName] || '';
                        const field = card.querySelector(`[data-field="${fieldName}"]`);
                        if (field && value) field.value = value;
                    });
                    if (item.extra && item.extra.otherFieldName) {
                        const field = card.querySelector(`[data-field="${item.extra.otherFieldName}"]`);
                        if (field && saved[item.extra.otherFieldName]) field.value = saved[item.extra.otherFieldName];
                    }
                    nonMedicationCardList.appendChild(card);
                });

                nonMedicationCardList.classList.toggle('hidden', nonMedicationCardList.children.length === 0);
                bindAutoResizeInScope(nonMedicationCardList);
            };
            nonMedicationSelection.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
                input.addEventListener('change', renderNonMedicationCards);
            });
            renderNonMedicationCards();

            bioSection.appendChild(bioWrap);
            body.appendChild(bioSection);

            const psychSection = createFieldGroup('心理社會治療區塊', document.createElement('div'));
            psychSection.classList.add('hidden');
            psychSection.dataset.section4Role = 'psych-section';
            const psychWrap = document.createElement('div');
            psychWrap.className = 'space-y-4';
            const psychItems = [
                { key: 'dbt', label: '辯證行為治療（DBT）' },
                { key: 'mbct', label: '正念認知療法（MBCT）' },
                { key: 'cbt', label: '認知行為治療（CBT）' },
                { key: 'cm', label: '權變管理（CM）' },
                { key: 'cra', label: '社群強化法（CRA）' },
                { key: 'mi', label: '動機式訪談（MI）' },
                { key: 'met', label: '動機強化治療（MET）' }
            ];
            const psychSelection = createFieldGroup('本方案使用哪些心理社會治療？', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'psychosocial_orientations',
                rowPrefix,
                options: psychItems.map(function (item) {
                    return { text: item.label, value: item.key };
                })
            }));
            psychWrap.appendChild(psychSelection);

            const psychPresetCardList = document.createElement('div');
            psychPresetCardList.className = 'space-y-4';
            psychWrap.appendChild(psychPresetCardList);

            const psychCustomList = document.createElement('div');
            psychCustomList.className = 'space-y-4';
            psychWrap.appendChild(psychCustomList);

            const addPsychBtn = document.createElement('button');
            addPsychBtn.type = 'button';
            addPsychBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
            addPsychBtn.textContent = '+ 新增心理社會治療項目';
            psychWrap.appendChild(addPsychBtn);

            let psychCustomCount = 0;
            const renderPsychPresetCards = function () {
                const preserved = {};
                Array.from(psychPresetCardList.querySelectorAll('.treatment-detail-panel')).forEach(function (card) {
                    preserved[card.dataset.detailKey] = {
                        course_mode: collectFieldValueByScope(card, 'course_mode'),
                        course_duration_value: collectFieldValueByScope(card, 'course_duration_value'),
                        course_duration_unit: collectFieldValueByScope(card, 'course_duration_unit'),
                        frequency_count: collectFieldValueByScope(card, 'frequency_count'),
                        frequency_period_unit: collectFieldValueByScope(card, 'frequency_period_unit'),
                        minutes_per_session: collectFieldValueByScope(card, 'minutes_per_session'),
                        psychosocial_formats: collectFieldValueByScope(card, 'psychosocial_formats'),
                        psychosocial_formats_other: collectOtherTextByScope(card, 'psychosocial_formats'),
                        note: collectFieldValueByScope(card, 'note')
                    };
                });
                clearNode(psychPresetCardList);
                psychItems.forEach(function (item) {
                    const checkbox = psychSelection.querySelector(`input[type="checkbox"][value="${item.key}"]`);
                    if (!checkbox || !checkbox.checked) return;
                    const card = createPsychosocialTreatmentCard(rowPrefix, item.key, item.label, {
                        group: 'psychosocial',
                        includeFormats: true,
                        notePlaceholder: '請說明此項目的實際執行方式'
                    });
                    const saved = preserved[item.key] || {};
                    if (saved.course_mode) {
                        const modeInput = card.querySelector(`input[type="radio"][data-field="course_mode"][value="${saved.course_mode}"]`);
                        if (modeInput) {
                            modeInput.checked = true;
                            modeInput.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                    ['course_duration_value', 'course_duration_unit', 'frequency_count', 'frequency_period_unit', 'minutes_per_session', 'note'].forEach(function (fieldName) {
                        const value = saved[fieldName] || '';
                        const field = card.querySelector(`[data-field="${fieldName}"]`);
                        if (field && value) field.value = value;
                    });
                    const savedFormats = Array.isArray(saved.psychosocial_formats) ? saved.psychosocial_formats : [];
                    card.querySelectorAll('input[type="checkbox"][data-field="psychosocial_formats"]').forEach(function (checkbox) {
                        checkbox.checked = savedFormats.indexOf(checkbox.value) >= 0;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    });
                    const savedFormatsOther = saved.psychosocial_formats_other || '';
                    const otherInput = card.querySelector('[data-other-for="psychosocial_formats"]');
                    if (otherInput && savedFormatsOther) {
                        otherInput.value = savedFormatsOther;
                    }
                    psychPresetCardList.appendChild(card);
                });
                bindAutoResizeInScope(psychPresetCardList);
            };
            psychSelection.querySelectorAll('input[type="checkbox"]').forEach(function (input) {
                input.addEventListener('change', renderPsychPresetCards);
            });
            addPsychBtn.addEventListener('click', function () {
                psychCustomCount += 1;
                psychCustomList.appendChild(createPsychosocialCustomItemCard(rowPrefix, psychCustomCount, null));
                bindAutoResizeInScope(psychCustomList);
            });
            renderPsychPresetCards();

            psychSection.appendChild(psychWrap);
            body.appendChild(psychSection);

            card.appendChild(body);
            cardList.appendChild(card);
            refreshContractedProcessSelects();

            const modeInputs = Array.from(modeGroup.querySelectorAll('input[type="checkbox"]'));
            const bioTypeInputs = Array.from(bioTypeGroup.querySelectorAll('input[type="checkbox"]'));
            const updateModeVisibility = function () {
                const selectedModes = modeInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.value; });
                const showBio = selectedModes.includes('生理治療');
                const showPsych = selectedModes.includes('心理社會治療');
                bioSection.classList.toggle('hidden', !showBio);
                psychSection.classList.toggle('hidden', !showPsych);
            };

            const updateBioVisibility = function () {
                const selectedBio = bioTypeInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.value; });
                medicationPanel.classList.toggle('hidden', !selectedBio.includes('藥物治療'));
                nonMedicationArea.classList.toggle('hidden', !selectedBio.includes('非藥物治療'));
                if (!selectedBio.includes('非藥物治療')) {
                    nonMedicationCardList.classList.add('hidden');
                } else {
                    nonMedicationCardList.classList.toggle('hidden', nonMedicationCardList.children.length === 0);
                }
            };

            modeInputs.forEach(function (input) { input.addEventListener('change', updateModeVisibility); });
            bioTypeInputs.forEach(function (input) { input.addEventListener('change', updateBioVisibility); });
            updateModeVisibility();
            updateBioVisibility();

            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderTreatment3bTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
        info.textContent = '請先選擇執行標的、執行場域與執行模式，再依需要展開生物治療或心理社會治療細項。3b 不調查具體精神科藥物名稱，僅盤點是否包含藥物治療或非藥物治療。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('treatment-card');
            card.dataset.templateKind = 'treatment';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.treatment-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';
            body.appendChild(createMultiSelectFieldGroup('執行標的', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            body.appendChild(createExecutionSitesFieldGroup(rowPrefix));

            const modeGroup = createFieldGroup('執行模式', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'treatment_modes',
                rowPrefix,
                options: [
                    { text: '生物治療', value: '生物治療' },
                    { text: '心理社會治療', value: '心理社會治療' }
                ]
            }));
            body.appendChild(modeGroup);

            const bioSection = createFieldGroup('生物治療區塊', document.createElement('div'));
            bioSection.classList.add('hidden');
            bioSection.dataset.section4Role = 'bio-section';
            const bioWrap = document.createElement('div');
            bioWrap.className = 'space-y-4';
            const bioTypeGroup = createFieldGroup('生物治療類型', createCompactChoiceGroup({
                type: 'checkbox',
                field: 'bio_treatment_items',
                rowPrefix,
                options: [
                    { text: '藥物治療', value: '藥物治療' },
                    { text: '非藥物治療', value: '非藥物治療' }
                ]
            }));
            bioWrap.appendChild(bioTypeGroup);

            const bioMedicationPanel = createModuleCard('藥物治療');
            bioMedicationPanel.classList.add('treatment-detail-panel', 'hidden');
            bioMedicationPanel.dataset.detailGroup = '3b-biological';
            bioMedicationPanel.dataset.detailKey = 'psychiatric_medication';
            bioMedicationPanel.dataset.itemLabel = '藥物治療';
            bioMedicationPanel.appendChild((function () {
                const body = document.createElement('div');
                body.className = 'space-y-4';
                body.appendChild(createMedicationCourseBlock(`${rowPrefix}_psychiatric_medication`));
                body.appendChild(buildTemplateTextareaGroup('項目說明', 'note', `${rowPrefix}_psychiatric_medication`, '請說明此藥物治療之實際執行方式'));
                return body;
            })());

            const bioNonMedicationPanel = createModuleCard('非藥物治療');
            bioNonMedicationPanel.classList.add('treatment-detail-panel', 'hidden');
            bioNonMedicationPanel.dataset.detailGroup = '3b-biological';
            bioNonMedicationPanel.dataset.detailKey = 'psychiatric_non_medication';
            bioNonMedicationPanel.dataset.itemLabel = '非藥物治療';
            bioNonMedicationPanel.appendChild((function () {
                const body = document.createElement('div');
                body.className = 'space-y-4';
                body.appendChild(createNonMedicationCourseBlock(`${rowPrefix}_psychiatric_non_medication`));
                body.appendChild(buildTemplateTextareaGroup('項目說明', 'note', `${rowPrefix}_psychiatric_non_medication`, '請說明此非藥物治療之實際執行方式'));
                return body;
            })());
            bioMedicationPanel.classList.add('hidden');
            bioNonMedicationPanel.classList.add('hidden');
            bioWrap.appendChild(bioMedicationPanel);
            bioWrap.appendChild(bioNonMedicationPanel);
            bioSection.appendChild(bioWrap);
            body.appendChild(bioSection);

            const psychSection = createFieldGroup('心理社會治療區塊', document.createElement('div'));
            psychSection.classList.add('hidden');
            psychSection.dataset.section4Role = 'psych-section';
            const psychWrap = document.createElement('div');
            psychWrap.className = 'space-y-4';
            psychWrap.appendChild(createPsychosocialCustomList(rowPrefix));
            psychSection.appendChild(psychWrap);
            body.appendChild(psychSection);

            body.appendChild(buildTemplateTextareaGroup('補充說明或整體說明', 'overall_note', rowPrefix, '請說明此方案之整體實際執行方式'));

            card.appendChild(body);
            cardList.appendChild(card);

            const modeInputs = Array.from(modeGroup.querySelectorAll('input[type="checkbox"]'));
            const bioTypeInputs = Array.from(bioTypeGroup.querySelectorAll('input[type="checkbox"]'));
            const updateModeVisibility = function () {
                const selectedModes = modeInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.value; });
                bioSection.classList.toggle('hidden', !selectedModes.includes('生物治療'));
                psychSection.classList.toggle('hidden', !selectedModes.includes('心理社會治療'));
            };
            const updateBioVisibility = function () {
                const selectedBio = bioTypeInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.value; });
                bioMedicationPanel.classList.toggle('hidden', !selectedBio.includes('藥物治療'));
                bioNonMedicationPanel.classList.toggle('hidden', !selectedBio.includes('非藥物治療'));
            };
            modeInputs.forEach(function (input) { input.addEventListener('change', updateModeVisibility); });
            bioTypeInputs.forEach(function (input) { input.addEventListener('change', updateBioVisibility); });
            updateModeVisibility();
            updateBioVisibility();

            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderTreatment3cTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
        info.textContent = '本項聚焦生理共病之處置重點與執行安排。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('treatment-card');
            card.dataset.templateKind = 'treatment';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.treatment-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';
            body.appendChild(createMultiSelectFieldGroup('執行標的', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            body.appendChild(createExecutionSitesFieldGroup(rowPrefix));
            body.appendChild(buildTemplateTextareaGroup('內容說明', 'open_description', rowPrefix, '請說明本方案針對生理共病之實際執行重點與安排。'));

            card.appendChild(body);
            cardList.appendChild(card);
            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderTreatment3dTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
        info.textContent = '請依序填寫執行標的、執行場域與說明。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('treatment-card');
            card.dataset.templateKind = 'treatment';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.treatment-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';
            body.appendChild(createMultiSelectFieldGroup('執行標的', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            body.appendChild(createExecutionSitesFieldGroup(rowPrefix));
            body.appendChild(buildTemplateTextareaGroup('說明', 'note', rowPrefix, '請說明本方案之主要執行內容與安排。'));

            card.appendChild(body);
            cardList.appendChild(card);
            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderTreatmentTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        if (id === 'matrix-3a') {
            renderTreatment3aTemplateSection(id, config);
            return;
        }
        if (id === 'matrix-3b') {
            renderTreatment3bTemplateSection(id, config);
            return;
        }
        if (id === 'matrix-3c') {
            renderTreatment3cTemplateSection(id, config);
            return;
        }
        if (id === 'matrix-3d') {
            renderTreatment3dTemplateSection(id, config);
            return;
        }

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100';
        info.textContent = '請依序填寫治療/處置/復健項目、執行方式、執行場域與服務安排。本區主要盤點服務流程與安排；量表、檢驗、監測工具請於第五區塊填寫，避免重複填報。';
        sectionDiv.appendChild(info);

        const cardList = document.createElement('div');
        cardList.className = 'space-y-4 mt-4';
        sectionDiv.appendChild(cardList);

        const actionRow = document.createElement('div');
        actionRow.className = 'mt-4 flex flex-wrap justify-start items-center gap-3';
        const addRowBtn = document.createElement('button');
        addRowBtn.type = 'button';
        addRowBtn.className = 'bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-3 rounded text-xs transition-colors';
        addRowBtn.textContent = '+ 新增下一項';
        actionRow.appendChild(addRowBtn);
        sectionDiv.appendChild(actionRow);

        let rowCount = 0;
        function createRow() {
            rowCount += 1;
            const rowPrefix = `${id}_row_${rowCount}`;
            const card = createCardShell('treatment-card');
            card.dataset.templateKind = 'treatment';
            card.dataset.rowPrefix = rowPrefix;

            const delBtn = createCardDeleteButton(function () {
                const rowCountCurrent = cardList.querySelectorAll('.treatment-card').length;
                if (rowCountCurrent > 1) {
                    card.remove();
                } else {
                    alert('方案規劃必須至少保留一項流程。');
                }
            });
            card.appendChild(delBtn);

            const body = document.createElement('div');
            body.className = 'space-y-4';

            if ((config.targetOptions || []).length > 0) {
                body.appendChild(createMultiSelectFieldGroup(config.targetLabel || '執行標的', 'topics', rowPrefix, config.targetOptions || [], { otherField: 'topics_other' }));
            }
            body.appendChild(createFieldGroup(config.itemLabel || '治療／處置／復健項目', createSelectWithOther('service_item', rowPrefix, config.itemOptions || [], '-- 請選擇 --', 'service_item_other')));
            body.appendChild(createMultiSelectFieldGroup(config.methodLabel || '執行方式', 'execution_methods', rowPrefix, config.methodOptions || [], { otherField: 'execution_methods_other' }));
            body.appendChild(createExecutionSitesFieldGroup(rowPrefix));
            body.appendChild(createUnifiedDoseBlock(rowPrefix));
            body.appendChild(buildTemplateTextareaGroup('補充說明', 'note', rowPrefix, config.notePlaceholder || '具體施行模式說明'));

            card.appendChild(body);
            cardList.appendChild(card);

            bindAutoResizeInScope(card);
        }

        addRowBtn.addEventListener('click', createRow);
        createRow();
        insertSectionByOrder(sectionDiv, id);
    }

    function renderSimpleNoteTemplateSection(id, config) {
        if (document.getElementById(`section-block-${id}`)) return;
        const sectionDiv = createSectionShell(id, config);

        const info = document.createElement('div');
        info.className = 'mb-4 text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-100';
        info.textContent = '請選擇最接近的歸類，再簡要說明原因。';
        sectionDiv.appendChild(info);

        const card = createCardShell('service-row-card');
        card.dataset.templateKind = 'simple-note';
        card.dataset.rowPrefix = `${id}_row_1`;

        const body = document.createElement('div');
        body.className = 'space-y-4';
        body.appendChild(createFieldGroup('無法歸類原因', createSelectWithOther('unavailable_reason', `${id}_row_1`, [
            '既有分類不足',
            '方案尚未定型',
            '資料院內無法取得',
            '非直接服務方案',
            '其他'
        ], '-- 請選擇 --', 'unavailable_reason_other')));
        body.appendChild(createFieldGroup('最接近哪一類', createFieldSelect('closest_category', `${id}_row_1`, [
            { value: '', text: '-- 請選擇 --', selected: true },
            { value: '篩檢／評估', text: '篩檢／評估' },
            { value: '短期介入／衛教／轉介', text: '短期介入／衛教／轉介' },
            { value: '專業治療', text: '專業治療' },
            { value: '復健／支持', text: '復健／支持' },
            { value: '無法判定', text: '無法判定' }
        ], 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none')));
        body.appendChild(buildTemplateTextareaGroup('簡要說明', 'note', `${id}_row_1`, '請簡要說明原因'));
        card.appendChild(body);
        sectionDiv.appendChild(card);
        bindAutoResizeInScope(card);
        insertSectionByOrder(sectionDiv, id);
    }

    function renderSection(id) {
        const config = configMatrix[id];
        if (!config) return;
        if (document.getElementById(`section-block-${id}`)) return;

        if (config.kind === 'assessment') {
            renderAssessmentTemplateSection(id, config);
            return;
        }

        if (config.kind === 'brief') {
            renderBriefTemplateSection(id, config);
            return;
        }

        if (config.kind === 'treatment') {
            renderTreatmentTemplateSection(id, config);
            return;
        }

        if (config.kind === 'simple-note') {
            renderSimpleNoteTemplateSection(id, config);
            return;
        }

        buildLegacySection(id, config);
        if (id && id.indexOf('matrix-') === 0) {
            refreshContractedProcessSelects();
        }
    }

    function removeSection(id) {
        const target = document.getElementById(`section-block-${id}`);
        if (target) target.remove();
        if (id && id.indexOf('matrix-') === 0) {
            refreshContractedProcessSelects();
        }
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
            var options = [
                { value: "bam_t", text: "BAM-T：台灣版簡要成癮監測表" },
                { value: "cgi", text: "CGI-S / CGI-I：臨床整體印象量表" },
                { value: "urica", text: "URICA：改變動機量表" },
                { value: "vas_craving", text: "VAS for Craving：渴求視覺類比量表" },
                { value: "acq_brief", text: "ACQ-Brief：安非他命渴求問卷簡版" },
                { value: "sows", text: "SOWS：主觀鴉片類戒斷量表" },
                { value: "cows", text: "COWS：臨床鴉片類戒斷量表" },
                { value: "ciwa_ar", text: "CIWA-Ar：酒精戒斷評估量表" },
                { value: "dsm5_sud", text: "DSM-5 物質使用障礙診斷與嚴重度標準" },
                { value: "dast10", text: "DAST-10：藥物濫用篩檢量表" },
                { value: "audit", text: "AUDIT / AUDIT-C：酒精使用疾患篩檢量表" },
                { value: "ftnd", text: "FTND：尼古丁依賴評估量表" },
                { value: "cage", text: "CAGE：酒精成癮篩檢量表" },
                { value: "assist", text: "ASSIST：酒精、菸草和物質參與篩檢作業" },
                { value: "bsrs5", text: "BSRS-5：簡式健康量表" },
                { value: "phq9", text: "PHQ-9 / PHQ-2：憂鬱篩檢" },
                { value: "gad7", text: "GAD-7：焦慮量表" },
                { value: "mini", text: "MINI：簡式國際精神醫學診斷會談" },
                { value: "bdi2", text: "BDI-II：貝克憂鬱量表第二版" },
                { value: "bai", text: "BAI：貝克焦慮量表" },
                { value: "stai", text: "STAI：狀態-特質焦慮量表" },
                { value: "panss", text: "PANSS：正負向症狀量表" },
                { value: "des", text: "DES：解離經驗量表" },
                { value: "pcl5", text: "PCL-5：創傷後壓力症候群檢核表" },
                { value: "whoqol_bref", text: "WHOQOL-BREF：生活品質問卷" },
                { value: "sofas", text: "SOFAS：社會與功能執行能力評估" },
                { value: "mos_ss", text: "MOS-SS：社會支持量表" },
                { value: "apgar", text: "APGAR：家庭功能量表" },
                { value: "moca", text: "MoCA：蒙特利爾認知評估" },
                { value: "mmse", text: "MMSE：簡易精神狀態檢查" },
                { value: "barthel", text: "BI / Barthel Index：巴氏量表" },
                { value: "other", text: "其他" }
            ];

            return createMultiSelectDropdown("s5_scale_tools", "請選擇量表型工具（可複選）", options);
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
            return createMultiSelectDropdown(name, "請選擇使用情境（可複選）", [
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
            useCaseWrapper.appendChild(createFieldLabel("使用情境（可複選）"));
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
                    : "例如：特定族群才檢查、檢驗可近性、等待時間、轉介流程或結果回收困難。"
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

        var section5CustomCounters = {
            scale_tools: 1,
            substance_tests: 1,
            medical_assessments: 1
        };

        var section5GroupMap = {
            scale_tools: {
                pickerId: "section5-scale-tool-picker",
                detailId: "section5-scale-tool-detail-container",
                allowCustom: true
            },
            substance_tests: {
                pickerId: "section5-substance-test-picker",
                detailId: "section5-substance-test-detail-container",
                allowCustom: true
            },
            medical_assessments: {
                pickerId: "section5-medical-assessment-picker",
                detailId: "section5-medical-assessment-detail-container",
                allowCustom: true
            }
        };

        var section5ScaleGroups = [
            {
                title: "核心成癮成效與戒癮動機",
                items: [
                    { id: "bam_t", label: "BAM-T：台灣版簡要成癮監測表" },
                    { id: "cgi", label: "CGI-S / CGI-I：臨床整體印象量表" },
                    { id: "urica", label: "URICA：改變動機量表" },
                    { id: "vas_craving", label: "VAS for Craving：渴求視覺類比量表" },
                    { id: "acq_brief", label: "ACQ-Brief：安非他命渴求問卷簡版" },
                    { id: "sows", label: "SOWS：主觀鴉片類戒斷量表" },
                    { id: "cows", label: "COWS：臨床鴉片類戒斷量表" },
                    { id: "ciwa_ar", label: "CIWA-Ar：酒精戒斷評估量表" }
                ]
            },
            {
                title: "物質使用、診斷與風險篩檢",
                items: [
                    { id: "dsm5_sud", label: "DSM-5 物質使用障礙診斷與嚴重度標準" },
                    { id: "dast10", label: "DAST-10：藥物濫用篩檢量表" },
                    { id: "audit", label: "AUDIT / AUDIT-C：酒精使用疾患篩檢量表" },
                    { id: "ftnd", label: "FTND：尼古丁依賴評估量表" },
                    { id: "cage", label: "CAGE：酒精成癮篩檢量表" },
                    { id: "assist", label: "ASSIST：酒精、菸草和物質參與篩檢作業" }
                ]
            },
            {
                title: "精神症狀與心理健康",
                items: [
                    { id: "bsrs5", label: "BSRS-5：簡式健康量表" },
                    { id: "phq9", label: "PHQ-9 / PHQ-2：憂鬱篩檢" },
                    { id: "gad7", label: "GAD-7：焦慮量表" },
                    { id: "mini", label: "MINI：簡式國際精神醫學診斷會談" },
                    { id: "bdi2", label: "BDI-II：貝克憂鬱量表第二版" },
                    { id: "bai", label: "BAI：貝克焦慮量表" },
                    { id: "stai", label: "STAI：狀態-特質焦慮量表" },
                    { id: "panss", label: "PANSS：正負向症狀量表" },
                    { id: "des", label: "DES：解離經驗量表" },
                    { id: "pcl5", label: "PCL-5：創傷後壓力症候群檢核表" }
                ]
            },
            {
                title: "社會支持、家庭功能與生活品質",
                items: [
                    { id: "whoqol_bref", label: "WHOQOL-BREF：生活品質問卷" },
                    { id: "sofas", label: "SOFAS：社會與功能執行能力評估" },
                    { id: "mos_ss", label: "MOS-SS：社會支持量表" },
                    { id: "apgar", label: "APGAR：家庭功能量表" }
                ]
            },
            {
                title: "認知、神經心理與生活功能",
                items: [
                    { id: "moca", label: "MoCA：蒙特利爾認知評估" },
                    { id: "mmse", label: "MMSE：簡易精神狀態檢查" },
                    { id: "barthel", label: "BI / Barthel Index：巴氏量表" }
                ]
            },
            {
                title: "其他特定行為、風險與介入評估流程",
                items: [
                    { id: "other", label: "其他" }
                ]
            }
        ];

        var section5SubstanceTests = [
            { id: "opioid", label: "鴉片類 / Opioids" },
            { id: "cns_stimulant", label: "安非他命 / 甲基安非他命" },
            { id: "ketamine", label: "K他命" },
            { id: "cannabis", label: "大麻類" },
            { id: "bzd", label: "BZD / 鎮靜安眠藥" },
            { id: "alcohol", label: "酒精" },
            { id: "nicotine", label: "尼古丁 / Cotinine" },
            { id: "etomidate", label: "依托咪酯" },
            { id: "other", label: "其他" }
        ];

        var section5MedicalAssessments = [
            { id: "hiv", label: "HIV相關檢測" },
            { id: "hcv", label: "HCV相關檢測" },
            { id: "hbv", label: "HBV相關檢測" },
            { id: "sti", label: "STI相關檢測" },
            { id: "tb", label: "肺結核篩檢" },
            { id: "pregnancy", label: "懷孕/生殖健康檢查" },
            { id: "ecg", label: "心電圖" },
            { id: "eeg", label: "腦波" },
            { id: "imaging", label: "影像檢查" },
            { id: "other", label: "其他" }
        ];

        function clearNode(node) {
            if (!node) return;
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
        }

        function getSelectedMatrixStages() {
            return Array.from(document.querySelectorAll('.matrix-checkbox:checked')).map(function (checkbox) {
                var label = checkbox.closest('label');
                var span = label ? label.querySelector('span') : null;

                return {
                    id: checkbox.value,
                    label: span ? span.textContent.trim() : checkbox.value
                };
            });
        }

        function buildChoiceLabel(fieldName, rowPrefix, item, options) {
            var label = createChoiceLabel('checkbox', fieldName, rowPrefix, item.id, item.label, {
                className: options && options.className ? options.className : 'mt-0.5',
                otherField: item.other ? `${fieldName}_other` : null,
                otherPlaceholder: options && options.otherPlaceholder ? options.otherPlaceholder : '請輸入其他內容',
                otherClassName: options && options.otherClassName ? options.otherClassName : 'inline-input w-40 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
            });

            var checkbox = label.querySelector('input[type="checkbox"]');
            checkbox.dataset.section5Role = item.other ? 'control' : 'choice';
            checkbox.dataset.section5ItemId = item.id;
            checkbox.dataset.section5ItemLabel = item.label;
            checkbox.dataset.section5IsCustom = item.custom ? '1' : '0';

            var otherInput = label.querySelector('input[type="text"]');
            if (otherInput) {
                otherInput.style.display = checkbox.checked ? '' : 'none';
                checkbox.addEventListener('change', function () {
                    otherInput.style.display = checkbox.checked ? '' : 'none';
                    if (!checkbox.checked) {
                        otherInput.value = '';
                    }
                });
            }

            return label;
        }

        function createSection5CheckboxGrid(fieldName, rowPrefix, items, options) {
            var grid = document.createElement('div');
            grid.className = 'section5-checkbox-grid';

            (items || []).forEach(function (item) {
                grid.appendChild(buildChoiceLabel(fieldName, rowPrefix, item, options));
            });

            return grid;
        }

        function createSection5SelectWithOther(fieldName, rowPrefix, options, otherFieldName) {
            var wrap = document.createElement('div');
            wrap.className = 'space-y-2';

            var select = createFieldSelect(fieldName, rowPrefix, options, 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none');
            wrap.appendChild(select);

            var otherInput = createFieldText(otherFieldName || `${fieldName}_other`, rowPrefix, '請輸入其他內容', 'hidden inline-input w-40 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none');
            wrap.appendChild(otherInput);

            var toggleOther = function () {
                otherInput.classList.toggle('hidden', select.value !== 'other');
                if (select.value !== 'other') {
                    otherInput.value = '';
                }
            };

            select.addEventListener('change', toggleOther);
            toggleOther();

            return wrap;
        }

        var SECTION3_ALL_STAGE_OPTIONS = [
            { id: 'matrix-1a', label: '1a. 物質使用障礙-篩檢' },
            { id: 'matrix-1b', label: '1b. 精神健康/共病-篩檢' },
            { id: 'matrix-1c', label: '1c. 生理共病-篩檢' },
            { id: 'matrix-1d', label: '1d. 社會/職業功能及復元支持-評估' },
            { id: 'matrix-2a', label: '2a. 物質使用障礙-短期介入/衛教/轉介' },
            { id: 'matrix-2b', label: '2b. 精神健康/共病-短期介入/衛教/轉介' },
            { id: 'matrix-2c', label: '2c. 生理共病-短期介入/衛教/轉介' },
            { id: 'matrix-2d', label: '2d. 社會/職業功能及復元支持-短期介入/衛教/轉介' },
            { id: 'matrix-3a', label: '3a. 物質使用障礙-專業治療' },
            { id: 'matrix-3b', label: '3b. 精神健康/共病-專業治療' },
            { id: 'matrix-3c', label: '3c. 生理共病-專業治療' },
            { id: 'matrix-3d', label: '3d. 社會/職業功能及復元支持-復健/培力' },
            { id: 'matrix-4x', label: '4. 不適用/無法填寫' }
        ];

        function getAllSection3Stages() {
            return SECTION3_ALL_STAGE_OPTIONS.slice();
        }

        function getSection5ContextStages(groupKey) {
            return getSelectedMatrixStages();
        }

        function createSection5UseContextBlock(groupKey, itemKey, preservedState, stageList) {
            var container = document.createElement('div');
            container.className = 'space-y-3';
            container.dataset.section5UseContextContainer = '1';
            container.dataset.section5GroupKey = groupKey;
            container.dataset.section5ItemKey = itemKey || '';

            var stages = Array.isArray(stageList) ? stageList : getSection5ContextStages(groupKey);
            if (!stages.length) {
                var note = document.createElement('div');
                note.className = 'text-xs text-slate-500 italic';
                note.textContent = groupKey === 'medical_assessments'
                    ? '請先勾選適用情境，系統將直接展開各情境的調查欄位。'
                    : '請先勾選適用情境，系統將依所選階段產生使用情境欄位。';
                container.appendChild(note);
                return container;
            }

            stages.forEach(function (stage) {
                var stageWrap = document.createElement('div');
                stageWrap.className = 'rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3';
                stageWrap.dataset.matrixId = stage.id;
                stageWrap.dataset.matrixLabel = stage.label;
                stageWrap.dataset.section5UseContextStage = '1';

                var stageTitle = document.createElement('div');
                stageTitle.className = 'text-sm font-semibold text-slate-800';
                stageTitle.textContent = stage.label;
                stageWrap.appendChild(stageTitle);

                if (groupKey !== 'medical_assessments') {
                    var usageRow = document.createElement('div');
                    usageRow.className = 'flex flex-wrap gap-2';

                    var usageLabel = document.createElement('div');
                    usageLabel.className = 'w-full text-xs font-semibold text-slate-600 mb-1';
                    usageLabel.textContent = '使用狀況';
                    usageRow.appendChild(usageLabel);

                    usageRow.appendChild(createChoiceLabel('radio', `${itemKey || 'section5'}_${stage.id}_usage`, `${itemKey || 'section5'}_${stage.id}`, 'none', '無', { className: 'mt-0.5' }));
                    usageRow.appendChild(createChoiceLabel('radio', `${itemKey || 'section5'}_${stage.id}_usage`, `${itemKey || 'section5'}_${stage.id}`, 'yes', '有', { className: 'mt-0.5' }));
                    stageWrap.appendChild(usageRow);
                }

                var detailRow = document.createElement('div');
                detailRow.className = groupKey === 'medical_assessments'
                    ? 'flex flex-wrap items-center gap-2 text-xs text-slate-600'
                    : 'hidden flex flex-wrap items-center gap-2 text-xs text-slate-600';
                detailRow.appendChild(document.createTextNode('期程長度'));
                detailRow.appendChild(createFieldNumber(`context_period_value_${stage.id}`, '', '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                detailRow.appendChild(createFieldSelect(`context_period_unit_${stage.id}`, '', [
                    { value: '日', text: '日' },
                    { value: '週', text: '週' },
                    { value: '月', text: '月' },
                    { value: '不適用', text: '不適用' }
                ], 'w-20 border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                detailRow.appendChild(document.createTextNode('總共'));
                detailRow.appendChild(createFieldNumber(`context_count_${stage.id}`, '', '', 'w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                detailRow.appendChild(document.createTextNode('次'));
                stageWrap.appendChild(detailRow);

                var stageState = preservedState && typeof preservedState === 'object'
                    ? (preservedState[stage.id] || {})
                    : {};
                if (groupKey !== 'medical_assessments' && stageState.usage) {
                    var usageInput = stageWrap.querySelector(`input[type="radio"][value="${stageState.usage}"]`);
                    if (usageInput) usageInput.checked = true;
                }
                if (stageState.period_value) {
                    var periodValue = stageWrap.querySelector(`[data-field="context_period_value_${stage.id}"]`);
                    if (periodValue) periodValue.value = stageState.period_value;
                }
                if (stageState.period_unit) {
                    var periodUnit = stageWrap.querySelector(`[data-field="context_period_unit_${stage.id}"]`);
                    if (periodUnit) periodUnit.value = stageState.period_unit;
                }
                if (stageState.count) {
                    var countInput = stageWrap.querySelector(`[data-field="context_count_${stage.id}"]`);
                    if (countInput) countInput.value = stageState.count;
                }
                if (groupKey !== 'medical_assessments') {
                    var radios = stageWrap.querySelectorAll('input[type="radio"]');
                    var updateVisibility = function () {
                        var checked = stageWrap.querySelector('input[type="radio"]:checked');
                        detailRow.classList.toggle('hidden', !checked || checked.value !== 'yes');
                    };
                    radios.forEach(function (radio) {
                        radio.addEventListener('change', updateVisibility);
                    });
                    updateVisibility();
                }
                container.appendChild(stageWrap);
            });

            return container;
        }

        function collectSection5UseContextStateFromCard(card) {
            var result = {};
            var isMedicalAssessment = (card.dataset.groupKey || '') === 'medical_assessments';
            card.querySelectorAll('[data-section5-use-context-stage="1"]').forEach(function (stageWrap) {
                var matrixId = stageWrap.dataset.matrixId;
                var usage = stageWrap.querySelector('input[type="radio"]:checked');
                result[matrixId] = {
                    usage: isMedicalAssessment ? 'yes' : (usage ? usage.value : ''),
                    period_value: (stageWrap.querySelector(`[data-field="context_period_value_${matrixId}"]`) || {}).value || '',
                    period_unit: (stageWrap.querySelector(`[data-field="context_period_unit_${matrixId}"]`) || {}).value || '',
                    count: (stageWrap.querySelector(`[data-field="context_count_${matrixId}"]`) || {}).value || ''
                };
            });
            return result;
        }

        function getMedicalAssessmentSelectedStagesFromCard(card) {
            return Array.from(card.querySelectorAll('input[type="checkbox"][data-field="applicable_contexts"]:checked')).map(function (input) {
                return {
                    id: input.value,
                    label: input.dataset.section5ItemLabel || input.value
                };
            });
        }

        function renderSection5UseContextIntoCard(card, preservedState, stageList) {
            var container = card.querySelector('[data-section5-use-context-container]');
            if (!container) return;
            clearNode(container);
            container.appendChild(createSection5UseContextBlock(card.dataset.groupKey || '', card.dataset.itemId || '', preservedState, stageList));
        }

        function collectSection5CardData(card) {
            var groupKey = card.dataset.groupKey || '';
            var useContextMap = collectSection5UseContextStateFromCard(card);
            var stages = groupKey === 'medical_assessments'
                ? getMedicalAssessmentSelectedStagesFromCard(card)
                : getSection5ContextStages(groupKey);
            var useContexts = stages.map(function (stage) {
                var state = useContextMap[stage.id] || {};
                return {
                    matrix_id: stage.id,
                    matrix_label: stage.label,
                    usage: state.usage || '',
                    period_value: state.period_value || '',
                    period_unit: state.period_unit || '',
                    count: state.count || ''
                };
            });

            var data = {
                item_id: card.dataset.itemId || '',
                item_name: card.dataset.itemLabel || '',
                item_other: card.dataset.itemOther || '',
                use_contexts: useContexts,
                use_contexts_map: useContextMap,
                data_management: [],
                data_management_other: (card.querySelector('[data-field="data_management_other"]') || {}).value || '',
                note: (card.querySelector('[data-field="note"]') || {}).value || ''
            };

            if (groupKey === 'scale_tools') {
                data.minutes_per_use = (card.querySelector('[data-field="minutes_per_use"]') || {}).value || '';
                data.use_method = (card.querySelector('select[data-field="use_method"]') || {}).value || '';
            } else if (groupKey === 'substance_tests') {
                data.test_paradigm = [];
                data.screening_specimens = [];
                data.screening_specimens_other = (card.querySelector('[data-field="screening_specimens_other"]') || {}).value || '';
                data.confirmation_specimens = [];
                data.confirmation_specimens_other = (card.querySelector('[data-field="confirmation_specimens_other"]') || {}).value || '';
                card.querySelectorAll('input[type="checkbox"][data-field]').forEach(function (input) {
                    if (!input.checked) return;
                    if (input.dataset.field === 'test_paradigm') data.test_paradigm.push(input.value);
                    if (input.dataset.field === 'screening_specimens') data.screening_specimens.push(input.value);
                    if (input.dataset.field === 'confirmation_specimens') data.confirmation_specimens.push(input.value);
                    if (input.dataset.field === 'data_management') data.data_management.push(input.value);
                });
            } else if (groupKey === 'medical_assessments') {
                card.querySelectorAll('input[type="checkbox"][data-field]').forEach(function (input) {
                    if (input.checked && input.dataset.field === 'data_management') data.data_management.push(input.value);
                });
            }

            card.querySelectorAll('input[type="checkbox"][data-field], input[type="radio"][data-field]').forEach(function (input) {
                if (!input.checked) return;
                if (input.dataset.field === 'data_management') {
                    if (data.data_management.indexOf(input.value) < 0) data.data_management.push(input.value);
                }
            });

            return data;
        }

        function refreshSection5StageFrequencyBlocks() {
            ['section5-scale-tool-detail-container', 'section5-substance-test-detail-container', 'section5-medical-assessment-detail-container'].forEach(function (containerId) {
                var container = document.getElementById(containerId);
                if (!container) return;

                Array.from(container.querySelectorAll('.section5-detail-card')).forEach(function (card) {
                    var preserved = collectSection5UseContextStateFromCard(card);
                    var stageList = card.dataset.groupKey === 'medical_assessments'
                        ? getMedicalAssessmentSelectedStagesFromCard(card)
                        : undefined;
                    renderSection5UseContextIntoCard(card, preserved, stageList);
                });
            });
        }

        function createSection5DetailCard(groupKey, item, preservedData) {
            var card = document.createElement('div');
            card.className = 'section5-card section5-detail-card';
            card.dataset.itemId = item.id;
            card.dataset.itemLabel = item.label;
            card.dataset.itemOther = item.custom ? item.label : '';
            card.dataset.groupKey = groupKey;

            var header = document.createElement('div');
            header.className = 'section5-card-header';

            var title = document.createElement('h4');
            title.className = 'section5-card-title';
            title.textContent = item.label;
            header.appendChild(title);

            var removeButton = createCardDeleteButton(function () {
                var picker = document.getElementById(section5GroupMap[groupKey].pickerId);
                if (!picker) return;
                var checkbox = picker.querySelector(`input[type="checkbox"][data-section5-role="choice"][data-section5-item-id="${item.id}"]`);
                if (checkbox) {
                    checkbox.checked = false;
                }
                syncSection5Group(groupKey);
            });
            header.appendChild(removeButton);
            card.appendChild(header);

            var body = document.createElement('div');
            body.className = 'space-y-4';

            if (groupKey === 'scale_tools') {
                var useMethodField = document.createElement('div');
                useMethodField.className = 'section5-field';
                useMethodField.appendChild(createFieldLabel('執行方式'));
                useMethodField.appendChild(createFieldSelect('use_method', item.id, [
                    { value: 'self_fill', text: '自填' },
                    { value: 'interview', text: '會談' },
                    { value: 'not_applicable', text: '不適用' }
                ], 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                body.appendChild(useMethodField);

                var minutesField = document.createElement('div');
                minutesField.className = 'section5-field';
                minutesField.appendChild(createFieldLabel('每次執行時間（分鐘）'));
                minutesField.appendChild(createFieldNumber('minutes_per_use', item.id, '', 'w-32 border border-gray-300 rounded px-2 py-1.5 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
                body.appendChild(minutesField);
            }

            if (groupKey === 'substance_tests') {
                var paradigmField = document.createElement('div');
                paradigmField.className = 'section5-field';
                paradigmField.appendChild(createFieldLabel('檢測範式'));
                paradigmField.appendChild(createSection5ChoiceGroup('test_paradigm', item.id, [
                    { id: 'screening', label: '篩檢' },
                    { id: 'confirmation', label: '確認' }
                ]));
                body.appendChild(paradigmField);

                var screeningField = document.createElement('div');
                screeningField.className = 'section5-field hidden';
                screeningField.dataset.section5SpecimenGroup = 'screening';
                screeningField.appendChild(createFieldLabel('篩檢檢體種類'));
                screeningField.appendChild(createSection5ChoiceGroup('screening_specimens', item.id, [
                    { id: 'urine', label: '尿液' },
                    { id: 'blood', label: '血液' },
                    { id: 'saliva', label: '唾液' },
                    { id: 'hair', label: '毛髮' },
                    { id: 'breath', label: '呼氣' },
                    { id: 'other', label: '其他', other: true }
                ]));
                body.appendChild(screeningField);

                var confirmationField = document.createElement('div');
                confirmationField.className = 'section5-field hidden';
                confirmationField.dataset.section5SpecimenGroup = 'confirmation';
                confirmationField.appendChild(createFieldLabel('確認檢體種類'));
                confirmationField.appendChild(createSection5ChoiceGroup('confirmation_specimens', item.id, [
                    { id: 'urine', label: '尿液' },
                    { id: 'blood', label: '血液' },
                    { id: 'saliva', label: '唾液' },
                    { id: 'hair', label: '毛髮' },
                    { id: 'breath', label: '呼氣' },
                    { id: 'other', label: '其他', other: true }
                ]));
                body.appendChild(confirmationField);

                var paradigmInputs = Array.from(paradigmField.querySelectorAll('input[type="checkbox"]'));
                var clearChoiceGroup = function (scope, fieldName) {
                    scope.querySelectorAll(`input[type="checkbox"][data-field="${fieldName}"]`).forEach(function (input) {
                        input.checked = false;
                    });
                    scope.querySelectorAll(`input[type="text"][data-field="${fieldName}_other"]`).forEach(function (input) {
                        input.value = '';
                        input.style.display = 'none';
                        input.disabled = true;
                    });
                };
                var updateSpecimenVisibility = function () {
                    var selected = paradigmInputs.filter(function (input) { return input.checked; }).map(function (input) { return input.value; });
                    var showScreening = selected.indexOf('screening') >= 0;
                    var showConfirmation = selected.indexOf('confirmation') >= 0;
                    screeningField.classList.toggle('hidden', !showScreening);
                    confirmationField.classList.toggle('hidden', !showConfirmation);
                    if (!showScreening) {
                        clearChoiceGroup(screeningField, 'screening_specimens');
                    }
                    if (!showConfirmation) {
                        clearChoiceGroup(confirmationField, 'confirmation_specimens');
                    }
                };
                paradigmInputs.forEach(function (input) {
                    input.addEventListener('change', updateSpecimenVisibility);
                });
                updateSpecimenVisibility();
            }

            if (groupKey === 'medical_assessments') {
                var applicableField = document.createElement('div');
                applicableField.className = 'section5-field';
                applicableField.appendChild(createFieldLabel('適用情境（可複選）'));
                applicableField.appendChild(createSection5ChoiceGroup('applicable_contexts', item.id, SECTION3_ALL_STAGE_OPTIONS));
                body.appendChild(applicableField);
            }

            var useContextField = document.createElement('div');
            useContextField.className = 'section5-field';
            useContextField.appendChild(createFieldLabel(groupKey === 'scale_tools' ? '量表使用情境' : '檢查使用情境'));
            var useContextContainer = document.createElement('div');
            useContextContainer.setAttribute('data-section5-use-context-container', '1');
            useContextField.appendChild(useContextContainer);
            body.appendChild(useContextField);

            if (groupKey === 'medical_assessments') {
                var refreshMedicalContexts = function () {
                    var currentState = collectSection5UseContextStateFromCard(card);
                    var selectedStages = getMedicalAssessmentSelectedStagesFromCard(card);
                    renderSection5UseContextIntoCard(card, currentState, selectedStages);
                };
                body.addEventListener('change', function (event) {
                    if (event.target && event.target.matches('input[type="checkbox"][data-field="applicable_contexts"]')) {
                        refreshMedicalContexts();
                    }
                });
                setTimeout(refreshMedicalContexts, 0);
            }

            var managementField = document.createElement('div');
            managementField.className = 'section5-field';
            managementField.appendChild(createFieldLabel('資料管理（可複選）'));
            managementField.appendChild(createSection5ChoiceGroup('data_management', item.id, [
                { id: 'paper', label: '紙本紀錄' },
                { id: 'his', label: '院內資訊系統（如 HIS / 個管系統）' },
                { id: 'excel', label: 'Excel/試算表' },
                { id: 'db', label: '藥酒癮個管系統' },
                { id: 'other', label: '其他', other: true }
            ]));
            body.appendChild(managementField);

            var noteField = document.createElement('div');
            noteField.className = 'section5-field';
            noteField.appendChild(createFieldLabel('補充說明（選填）'));
            noteField.appendChild(createFieldTextarea('note', item.id, '請補充說明', 'block w-full min-h-[96px] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base'));
            body.appendChild(noteField);

            card.appendChild(body);
            bindAutoResizeInScope(card);

            if (preservedData) {
                if (preservedData.minutes_per_use) {
                    var minutesInput = card.querySelector('[data-field="minutes_per_use"]');
                    if (minutesInput) minutesInput.value = preservedData.minutes_per_use;
                }
                if (preservedData.use_method) {
                    var useMethodInput = card.querySelector('select[data-field="use_method"]');
                    if (useMethodInput) {
                        useMethodInput.value = preservedData.use_method;
                    }
                }
                if (preservedData.note) {
                    var noteInput = card.querySelector('[data-field="note"]');
                    if (noteInput) noteInput.value = preservedData.note;
                }
                ['data_management', 'test_paradigm', 'screening_specimens', 'confirmation_specimens'].forEach(function (fieldName) {
                    var saved = preservedData[fieldName] || [];
                    card.querySelectorAll(`input[data-field="${fieldName}"]`).forEach(function (input) {
                        if (saved.indexOf(input.value) >= 0) {
                            input.checked = true;
                        }
                    });
                });
                if (preservedData.data_management_other) {
                    var mgmtOther = card.querySelector('[data-field="data_management_other"]');
                    if (mgmtOther) mgmtOther.value = preservedData.data_management_other;
                }
                if (preservedData.screening_specimens_other) {
                    var screeningOther = card.querySelector('[data-field="screening_specimens_other"]');
                    if (screeningOther) screeningOther.value = preservedData.screening_specimens_other;
                }
                if (preservedData.confirmation_specimens_other) {
                    var confirmationOther = card.querySelector('[data-field="confirmation_specimens_other"]');
                    if (confirmationOther) confirmationOther.value = preservedData.confirmation_specimens_other;
                }
                if (groupKey === 'medical_assessments') {
                    var savedContexts = preservedData.applicable_contexts || Object.keys(preservedData.use_contexts_map || {});
                    card.querySelectorAll('input[type="checkbox"][data-field="applicable_contexts"]').forEach(function (input) {
                        input.checked = savedContexts.indexOf(input.value) >= 0;
                    });
                }
                card.querySelectorAll('label').forEach(function (labelNode) {
                    var checkbox = labelNode.querySelector('input[type="checkbox"]');
                    var textInput = labelNode.querySelector('input[type="text"]');
                    if (checkbox && textInput) {
                        textInput.style.display = checkbox.checked ? '' : 'none';
                        textInput.disabled = !checkbox.checked;
                    }
                });
                if (groupKey === 'substance_tests') {
                    card.querySelectorAll('[data-section5-specimen-group]').forEach(function (specimenGroup) {
                        var isHidden = specimenGroup.dataset.section5SpecimenGroup === 'screening'
                            ? !card.querySelector('input[type="checkbox"][data-field="test_paradigm"][value="screening"]')?.checked
                            : !card.querySelector('input[type="checkbox"][data-field="test_paradigm"][value="confirmation"]')?.checked;
                        specimenGroup.classList.toggle('hidden', isHidden);
                    });
                }
                renderSection5UseContextIntoCard(card, preservedData.use_contexts_map || {}, groupKey === 'medical_assessments' ? getMedicalAssessmentSelectedStagesFromCard(card) : undefined);
            } else {
                renderSection5UseContextIntoCard(card, {}, groupKey === 'medical_assessments' ? getMedicalAssessmentSelectedStagesFromCard(card) : undefined);
            }

            return card;
        }

        function createSection5ChoiceGroup(fieldName, rowPrefix, items) {
            var grid = document.createElement('div');
            grid.className = 'section5-checkbox-grid';

            (items || []).forEach(function (item) {
                var label = createChoiceLabel('checkbox', fieldName, rowPrefix, item.id, item.label, {
                    className: 'mt-0.5',
                    otherField: item.other ? `${fieldName}_other` : null,
                    otherPlaceholder: '請輸入其他內容',
                    otherClassName: 'inline-input w-36 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none'
                });
                var checkbox = label.querySelector('input[type="checkbox"]');
                checkbox.dataset.section5Role = 'choice';
                checkbox.dataset.section5ItemId = item.id;
                checkbox.dataset.section5ItemLabel = item.label;
                checkbox.dataset.section5IsCustom = item.custom ? '1' : '0';

                var otherInput = label.querySelector('input[type="text"]');
                if (otherInput) {
                    otherInput.style.display = checkbox.checked ? '' : 'none';
                    otherInput.disabled = !checkbox.checked;
                    checkbox.addEventListener('change', function () {
                        otherInput.style.display = checkbox.checked ? '' : 'none';
                        otherInput.disabled = !checkbox.checked;
                        if (!checkbox.checked) {
                            otherInput.value = '';
                        }
                    });
                }
                grid.appendChild(label);
            });

            return grid;
        }

        function renderPickerGroup(groupKey, pickerContainer, detailContainer, groupConfig) {
            var groupWrap = document.createElement('div');
            groupWrap.className = 'space-y-3';

            if (groupConfig.title) {
                var heading = document.createElement('div');
                heading.className = 'text-sm font-semibold text-slate-700';
                heading.textContent = groupConfig.title;
                groupWrap.appendChild(heading);
            }

            var grid = document.createElement('div');
            grid.className = 'section5-checkbox-grid';
            var otherControlLabel = '其他';

            var controlRow = null;
            var addWrap = null;
            var controlCheckbox = null;
            var otherInput = null;

            (groupConfig.items || []).forEach(function (item) {
                if (item.id === 'other') {
                    otherControlLabel = item.label || '其他';
                    return;
                }
                var label = createChoiceLabel('checkbox', 's5_picker_choice', groupKey, item.id, item.label, { className: 'mt-0.5' });
                var checkbox = label.querySelector('input[type="checkbox"]');
                checkbox.dataset.section5Role = 'choice';
                checkbox.dataset.section5ItemId = item.id;
                checkbox.dataset.section5ItemLabel = item.label;
                checkbox.dataset.section5IsCustom = item.custom ? '1' : '0';
                checkbox.addEventListener('change', function () {
                    syncSection5Group(groupKey);
                });
                grid.appendChild(label);
            });

            if (groupConfig.allowCustom) {
                controlRow = document.createElement('div');
                controlRow.className = 'mt-3 space-y-2';

                var controlLabel = createChoiceLabel('checkbox', 's5_picker_control', groupKey, 'other', otherControlLabel || '其他', { className: 'mt-0.5' });
                controlCheckbox = controlLabel.querySelector('input[type="checkbox"]');
                controlCheckbox.dataset.section5Role = 'control';
                controlCheckbox.dataset.section5Control = 'other';

                addWrap = document.createElement('div');
                addWrap.className = 'hidden flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3';

                otherInput = createFieldText(`${groupKey}_other_custom_name`, '', '請輸入其他項目名稱', 'w-64 border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none');
                addWrap.appendChild(otherInput);

                var addBtn = document.createElement('button');
                addBtn.type = 'button';
                addBtn.className = 'bg-slate-800 hover:bg-slate-900 text-white font-medium py-1 px-3 rounded text-xs';
                addBtn.textContent = '新增其他項目';
                addWrap.appendChild(addBtn);

                var hint = document.createElement('div');
                hint.className = 'w-full text-xs text-slate-500';
                hint.textContent = '勾選「其他」後可新增自訂項目名稱。';
                addWrap.appendChild(hint);

                controlRow.appendChild(controlLabel);
                controlRow.appendChild(addWrap);

                controlCheckbox.addEventListener('change', function () {
                    addWrap.classList.toggle('hidden', !controlCheckbox.checked);
                    if (!controlCheckbox.checked) {
                        otherInput.value = '';
                    }
                });

                addBtn.addEventListener('click', function () {
                    var value = otherInput.value.trim();
                    if (!value) return;

                    var customId = `other_custom_${section5CustomCounters[groupKey]++}`;
                    var customItem = {
                        id: customId,
                        label: value,
                        custom: true
                    };
                    var customWrap = document.createElement('div');
                    customWrap.className = 'flex items-center gap-2';

                    var customLabel = createChoiceLabel('checkbox', 's5_picker_choice', groupKey, customItem.id, customItem.label, { className: 'mt-0.5' });
                    var customCheckbox = customLabel.querySelector('input[type="checkbox"]');
                    customCheckbox.dataset.section5Role = 'choice';
                    customCheckbox.dataset.section5ItemId = customItem.id;
                    customCheckbox.dataset.section5ItemLabel = customItem.label;
                    customCheckbox.dataset.section5IsCustom = '1';
                    customCheckbox.addEventListener('change', function () {
                        syncSection5Group(groupKey);
                    });

                    var deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.className = 'text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded border border-red-200 bg-white';
                    deleteBtn.textContent = '刪除';
                    deleteBtn.addEventListener('click', function () {
                        customWrap.remove();
                        syncSection5Group(groupKey);
                    });

                    customWrap.appendChild(customLabel);
                    customWrap.appendChild(deleteBtn);
                    grid.appendChild(customWrap);
                    customCheckbox.checked = true;
                    otherInput.value = '';
                    controlCheckbox.checked = false;
                    addWrap.classList.add('hidden');
                    syncSection5Group(groupKey);
                });
            }

            groupWrap.appendChild(grid);

            if (controlRow) {
                groupWrap.appendChild(controlRow);
            }

            pickerContainer.appendChild(groupWrap);
        }

        function renderScaleToolsOtherAdder(pickerContainer) {
            if (!pickerContainer) return;
            if (pickerContainer.querySelector('[data-section5-scale-other-adder="1"]')) return;

            var groupWrap = document.createElement('div');
            groupWrap.className = 'space-y-3 mt-4';
            groupWrap.dataset.section5ScaleOtherAdder = '1';

            var heading = document.createElement('div');
            heading.className = 'text-sm font-semibold text-slate-700';
            heading.textContent = '其他量表工具';
            groupWrap.appendChild(heading);

            var customGrid = document.createElement('div');
            customGrid.className = 'section5-checkbox-grid';
            customGrid.dataset.section5CustomGrid = 'scale_tools';
            groupWrap.appendChild(customGrid);

            var controlRow = document.createElement('div');
            controlRow.className = 'mt-3 space-y-2';

            var controlLabel = createChoiceLabel('checkbox', 's5_picker_control', 'scale_tools', 'other', '其他', { className: 'mt-0.5' });
            var controlCheckbox = controlLabel.querySelector('input[type="checkbox"]');
            controlCheckbox.dataset.section5Role = 'control';
            controlCheckbox.dataset.section5Control = 'other';
            controlRow.appendChild(controlLabel);

            var addWrap = document.createElement('div');
            addWrap.className = 'hidden flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3';

            var otherInput = createFieldText('scale_tools_other_custom_name', '', '請輸入其他量表工具名稱', 'w-64 border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none');
            addWrap.appendChild(otherInput);

            var addBtn = document.createElement('button');
            addBtn.type = 'button';
            addBtn.className = 'bg-slate-800 hover:bg-slate-900 text-white font-medium py-1 px-3 rounded text-xs';
            addBtn.textContent = '新增其他量表工具';
            addWrap.appendChild(addBtn);

            var hint = document.createElement('div');
            hint.className = 'w-full text-xs text-slate-500';
            hint.textContent = '勾選「其他」後可新增自訂量表工具名稱。';
            addWrap.appendChild(hint);

            controlCheckbox.addEventListener('change', function () {
                addWrap.classList.toggle('hidden', !controlCheckbox.checked);
                if (!controlCheckbox.checked) {
                    otherInput.value = '';
                }
            });

            addBtn.addEventListener('click', function () {
                var value = otherInput.value.trim();
                if (!value) return;

                var duplicated = Array.from(pickerContainer.querySelectorAll('input[type="checkbox"][data-section5-role="choice"]')).some(function (checkbox) {
                    return (checkbox.dataset.section5ItemLabel || '').trim() === value;
                });
                if (duplicated) {
                    alert('此量表工具名稱已存在。');
                    return;
                }

                var customId = 'scale_custom_' + section5CustomCounters.scale_tools++;
                var customWrap = document.createElement('div');
                customWrap.className = 'flex items-center gap-2';

                var customLabel = createChoiceLabel('checkbox', 's5_picker_choice', 'scale_tools', customId, value, { className: 'mt-0.5' });
                var customCheckbox = customLabel.querySelector('input[type="checkbox"]');
                customCheckbox.dataset.section5Role = 'choice';
                customCheckbox.dataset.section5ItemId = customId;
                customCheckbox.dataset.section5ItemLabel = value;
                customCheckbox.dataset.section5IsCustom = '1';
                customCheckbox.addEventListener('change', function () {
                    syncSection5Group('scale_tools');
                });

                var deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.className = 'text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded border border-red-200 bg-white';
                deleteBtn.textContent = '刪除';
                deleteBtn.addEventListener('click', function () {
                    customWrap.remove();
                    syncSection5Group('scale_tools');
                });

                customWrap.appendChild(customLabel);
                customWrap.appendChild(deleteBtn);
                customGrid.appendChild(customWrap);
                customCheckbox.checked = true;
                otherInput.value = '';
                controlCheckbox.checked = false;
                addWrap.classList.add('hidden');

                syncSection5Group('scale_tools');
                bindAutoResizeInScope(groupWrap);
            });

            controlRow.appendChild(addWrap);
            groupWrap.appendChild(controlRow);
            pickerContainer.appendChild(groupWrap);
            bindAutoResizeInScope(groupWrap);
        }

        function syncSection5Group(groupKey) {
            var groupConfig = section5GroupMap[groupKey];
            var pickerContainer = document.getElementById(groupConfig.pickerId);
            var detailContainer = document.getElementById(groupConfig.detailId);
            if (!pickerContainer || !detailContainer) return;

            var existing = {};
            Array.from(detailContainer.querySelectorAll('.section5-detail-card')).forEach(function (card) {
                existing[card.dataset.itemId] = collectSection5CardData(card);
            });

            clearNode(detailContainer);

            var checkedItems = Array.from(pickerContainer.querySelectorAll('input[type="checkbox"][data-section5-role="choice"]:checked'));
            checkedItems.forEach(function (checkbox) {
                var item = {
                    id: checkbox.dataset.section5ItemId,
                    label: checkbox.dataset.section5ItemLabel,
                    custom: checkbox.dataset.section5IsCustom === '1'
                };
                detailContainer.appendChild(createSection5DetailCard(groupKey, item, existing[item.id]));
            });
        }

        function initSection5() {
            Object.keys(section5GroupMap).forEach(function (groupKey) {
                var groupConfig = section5GroupMap[groupKey];
                var pickerContainer = document.getElementById(groupConfig.pickerId);
                var detailContainer = document.getElementById(groupConfig.detailId);
                if (!pickerContainer || !detailContainer) return;

                clearNode(pickerContainer);

                if (groupKey === 'scale_tools') {
                    section5ScaleGroups.forEach(function (group) {
                        renderPickerGroup(groupKey, pickerContainer, detailContainer, group);
                    });
                    renderScaleToolsOtherAdder(pickerContainer);
                } else if (groupKey === 'substance_tests') {
                    renderPickerGroup(groupKey, pickerContainer, detailContainer, {
                        title: '',
                        items: section5SubstanceTests,
                        allowCustom: true
                    });
                } else if (groupKey === 'medical_assessments') {
                    renderPickerGroup(groupKey, pickerContainer, detailContainer, {
                        title: '',
                        items: section5MedicalAssessments,
                        allowCustom: true
                    });
                }
            });

            refreshSection5StageFrequencyBlocks();
        }

        window.refreshSection5StageFrequencyBlocks = refreshSection5StageFrequencyBlocks;
        window.getSelectedMatrixStages = getSelectedMatrixStages;
        window.collectSection5CardData = collectSection5CardData;

        runWhenReady(function () {
            initSection5();
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

    function createMultiSelect(options, className) {
        const select = document.createElement('select');
        select.className = className;
        select.multiple = true;
        select.size = Math.min(Math.max(options.length, 4), 8);

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

    function getSection3PositionOptions() {
        const seen = new Set();
        const options = [];

        Array.from(document.querySelectorAll('#dynamic-program-container [id^="section-block-matrix-"]')).forEach(function (section) {
            const matrixId = section.id.replace('section-block-', '');
            const config = configMatrix[matrixId];
            const title = config && config.title ? config.title : '未命名定位';
            if (!seen.has(title)) {
                seen.add(title);
                options.push(title);
            }
        });

        return options;
    }

    function refreshContractedProcessSelects() {
        const options = getSection3PositionOptions();
        document.querySelectorAll('select[data-contract-position-select="1"]').forEach(function (select) {
            const currentValue = select.value || '';
            select.innerHTML = '';

            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = options.length ? '-- 請選擇 --' : '請先勾選第三區塊項目';
            select.appendChild(placeholder);

            options.forEach(function (item) {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                select.appendChild(option);
            });

            if (options.includes(currentValue)) {
                select.value = currentValue;
            } else {
                select.value = '';
            }
        });
    }

    function appendFundedStaffRow() {
        const tbody = document.getElementById('tbody-funded-staff');
        if (!tbody) return;

        const tr = document.createElement('tr');

        const tdFunding = document.createElement('td');
        const fundingSelect = createSelect(
            ['計畫主持人', '共同主持人', '專任'],
            'w-full text-center'
        );
        fundingSelect.dataset.field = 'funding_type';
        tdFunding.appendChild(fundingSelect);

        const tdRole = document.createElement('td');
        const roleSelect = createSelect(staffRoleOptions, 'w-full text-center');
        roleSelect.dataset.field = 'staff_role';
        tdRole.appendChild(roleSelect);

        const tdSeniority = document.createElement('td');
        const seniorityInput = createInput(
            'number',
            '證照年份 / 年資',
            'w-full text-center'
        );
        seniorityInput.dataset.field = 'professional_seniority_years';
        tdSeniority.appendChild(seniorityInput);

        const tdWork = document.createElement('td');
        const workTextarea = createAutoTextarea(
            '如：評估、治療、個管、衛教',
            'w-full text-left border-none resize-none'
        );
        workTextarea.dataset.field = 'main_work_content';
        tdWork.appendChild(workTextarea);

        const tdRequirement = document.createElement('td');
        const requirementTextarea = createAutoTextarea(
            '如：成癮訓練、MI、CBT',
            'w-full text-left border-none resize-none'
        );
        requirementTextarea.dataset.field = 'background_or_requirement';
        tdRequirement.appendChild(requirementTextarea);

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
        const feeTypeSelect = createSelect(
            ['培訓督導相關', '服務提供相關', '研究相關'],
            'w-full text-center'
        );
        feeTypeSelect.dataset.field = 'fee_type';
        tdFeeType.appendChild(feeTypeSelect);

        const tdRole = document.createElement('td');
        const roleTitleTextarea = createAutoTextarea(
            '請輸入職稱',
            'w-full text-left border-none resize-none'
        );
        roleTitleTextarea.dataset.field = 'role_title';
        tdRole.appendChild(roleTitleTextarea);

        const tdFrequency = document.createElement('td');
        const processSelect = document.createElement('select');
        processSelect.className = 'w-full text-left border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none';
        processSelect.dataset.contractPositionSelect = '1';
        processSelect.dataset.field = 'related_section3_position';
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = '請先勾選第三區塊項目';
        placeholder.selected = true;
        processSelect.appendChild(placeholder);
        tdFrequency.appendChild(processSelect);

        const tdPurpose = document.createElement('td');
        const purposeTextarea = createAutoTextarea(
            '如：治療、督導、衛教',
            'w-full text-left border-none resize-none'
        );
        purposeTextarea.dataset.field = 'work_description';
        tdPurpose.appendChild(purposeTextarea);

        const tdCost = document.createElement('td');
        const costTextarea = createAutoTextarea(
            '如：1場2000元/2小時',
            'w-full text-left border-none resize-none'
        );
        costTextarea.dataset.field = 'cost_description';
        tdCost.appendChild(costTextarea);

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
        const programName = form.querySelector('[name="program_name"]');
        const operatingAgency = form.querySelector('[name="operating_agency"]');
        const directorName = form.querySelector('[name="program_director_name"]');
        const directorTitle = form.querySelector('[name="program_director_title"]');
        const subProgramName = document.getElementById('sub-program-name');
        const maxCapacity = document.getElementById('max-capacity');
        const monthlyNewCases = document.getElementById('monthly-new-cases');
        const selectedProgramOption = programName?.selectedOptions?.[0];
        const programMeta = selectedProgramOption?.dataset?.programMeta || '';

        const checkedServiceType = form.querySelector('input[name="service_type"]:checked');
        const serviceTypeOtherInput = checkedServiceType?.closest('label')?.querySelector('input[type="text"]') || null;
        const serviceTypeOther = checkedServiceType && checkedServiceType.value === '其他'
            ? serviceTypeOtherInput?.value || ''
            : '';

        return {
            program_name: programName?.value || '',
            program_meta: programMeta,
            operating_agency: operatingAgency?.value || '',
            program_director_name: directorName?.value || '',
            program_director_title: directorTitle?.value || '',
            sub_program_name: subProgramName?.value || '',
            service_type: checkedServiceType ? getFieldValue(checkedServiceType) : '',
            service_type_other: serviceTypeOther,
            max_capacity: maxCapacity?.value || '',
            monthly_new_cases: monthlyNewCases?.value || ''
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
        const primarySubstances = collectCheckedFieldValues('primary_substances');
        const recipients = collectCheckedFieldValues('recipients');
        const targetAgeGroups = collectCheckedFieldValues('target_age_groups');
        const genderGroups = collectCheckedFieldValues('gender_groups');
        const specialPopulations = collectCheckedFieldValues('co_occurring_special_populations');
        return {
            recipients: recipients,
            recipients_other: recipients.includes('其他')
                ? (document.querySelector('[data-field="recipients_other"]')?.value || '')
                : '',

            target_age_groups: targetAgeGroups,
            target_age_group_other: targetAgeGroups.includes('其他')
                ? (document.querySelector('[data-field="target_age_group_other"]')?.value || '')
                : '',

            gender_groups: genderGroups,
            gender_group_other: genderGroups.includes('其他')
                ? (document.querySelector('[data-field="gender_group_other"]')?.value || '')
                : '',

            primary_substances: primarySubstances,
            primary_substance_other: primarySubstances.includes('其他')
                ? (document.querySelector('[data-field="primary_substances_other"]')?.value || '')
                : '',

            co_occurring_special_populations: specialPopulations,
            co_occurring_special_population_other: specialPopulations.includes('其他')
                ? (document.querySelector('[data-field="co_occurring_special_population_other"]')?.value || '')
                : ''
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

    function collectFieldValueByScope(scope, fieldName) {
        const fields = Array.from(scope.querySelectorAll(`[data-field="${fieldName}"]`));
        if (!fields.length) return '';

        const typeSet = new Set(fields.map(field => (field.type || '').toLowerCase()));
        if (typeSet.has('checkbox')) {
            return fields
                .filter(field => field.checked)
                .map(field => field.value || '')
                .filter(Boolean);
        }

        if (typeSet.has('radio')) {
            const checked = fields.find(field => field.checked);
            return checked ? checked.value || '' : '';
        }

        return fields[0]?.value || '';
    }

    function collectOtherTextByScope(scope, fieldName) {
        const otherInput = scope.querySelector(`[data-other-for="${fieldName}"]`);
        return otherInput?.value || '';
    }

    function collectUnifiedDoseData(scope) {
        return {
            dose_mode: collectFieldValueByScope(scope, 'dose_mode') || '',
            single_minutes: collectFieldValueByScope(scope, 'single_minutes') || '',
            duration_value: collectFieldValueByScope(scope, 'duration_value') || '',
            duration_unit: collectFieldValueByScope(scope, 'duration_unit') || '',
            total_count: collectFieldValueByScope(scope, 'total_count') || '',
            minutes_per_session: collectFieldValueByScope(scope, 'minutes_per_session') || ''
        };
    }

    function collectTreatment3aDetailData(panel) {
        const toggleField = panel.dataset.toggleField || '';
        const toggle = toggleField ? panel.querySelector(`[data-field="${toggleField}"]`) : null;
        if (toggleField) {
            if (!toggle || !toggle.checked) return null;
        }

        const detailGroup = panel.dataset.detailGroup || '';
        const itemLabel = panel.dataset.itemLabel || (toggle ? toggle.value : '') || '';
        const otherInput = panel.querySelector('[data-detail-other="1"]');
        const medicationType = collectFieldValueByScope(panel, 'medication_type') || '';
        const medicationTypeOther = collectOtherTextByScope(panel, 'medication_type') || '';
        const baseDose = collectUnifiedDoseData(panel);
        const courseData = {
            course_mode: collectFieldValueByScope(panel, 'course_mode') || '',
            course_duration_value: collectFieldValueByScope(panel, 'course_duration_value') || '',
            course_duration_unit: collectFieldValueByScope(panel, 'course_duration_unit') || '',
            course_total_count: collectFieldValueByScope(panel, 'course_total_count') || '',
            frequency_period_value: collectFieldValueByScope(panel, 'frequency_period_value') || '',
            frequency_period_unit: collectFieldValueByScope(panel, 'frequency_period_unit') || '',
            frequency_count: collectFieldValueByScope(panel, 'frequency_count') || '',
            minutes_per_session: collectFieldValueByScope(panel, 'minutes_per_session') || ''
        };
        const detailKey = panel.dataset.detailKey || '';
        const sanitizeCourseData = function () {
            if (detailGroup === 'biological-non-medication') {
                if (courseData.course_mode === 'limited') {
                    courseData.frequency_period_value = '';
                    courseData.frequency_period_unit = '';
                    courseData.frequency_count = '';
                } else if (courseData.course_mode === 'maintenance') {
                    courseData.course_duration_value = '';
                    courseData.course_duration_unit = '';
                    courseData.course_total_count = '';
                } else {
                    courseData.course_duration_value = '';
                    courseData.course_duration_unit = '';
                    courseData.course_total_count = '';
                    courseData.frequency_period_value = '';
                    courseData.frequency_period_unit = '';
                    courseData.frequency_count = '';
                }
                return;
            }

            if (detailGroup === 'psychosocial' || detailGroup === 'psychosocial-custom' || detailGroup === '3b-psychosocial') {
                if (courseData.course_mode === 'open_ended') {
                    courseData.course_duration_value = '';
                    courseData.course_duration_unit = '';
                } else if (courseData.course_mode === 'not_applicable') {
                    courseData.course_duration_value = '';
                    courseData.course_duration_unit = '';
                    courseData.frequency_count = '';
                    courseData.frequency_period_unit = '';
                    courseData.minutes_per_session = '';
                }
                return;
            }

            const isMedicationDetail = detailGroup === 'biological-medication' || detailKey === 'primary_medication' || detailKey === 'psychiatric_medication';
            if (isMedicationDetail) {
                if (courseData.course_mode === 'maintenance' || courseData.course_mode === 'not_applicable' || courseData.course_mode === 'open_ended') {
                    courseData.course_duration_value = '';
                    courseData.course_duration_unit = '';
                }
                return;
            }

            if (courseData.course_mode === 'maintenance' || courseData.course_mode === 'open_ended') {
                courseData.course_duration_value = '';
                courseData.course_duration_unit = '';
                courseData.course_total_count = '';
            } else if (courseData.course_mode === 'not_applicable') {
                courseData.course_duration_value = '';
                courseData.course_duration_unit = '';
                courseData.course_total_count = '';
                courseData.frequency_period_value = '';
                courseData.frequency_period_unit = '';
                courseData.frequency_count = '';
            }
        };
        sanitizeCourseData();
        const note = panel.querySelector('textarea[data-field="note"]')?.value || '';
        const hasAnyContent = Array.from(panel.querySelectorAll('input, select, textarea')).some(function (field) {
            if (field.type === 'checkbox' || field.type === 'radio') {
                return field.checked;
            }
            return (field.value || '').trim() !== '';
        });

        if (!toggleField && !hasAnyContent) return null;

        if (detailGroup === 'psychosocial-custom') {
            const customName = collectFieldValueByScope(panel, 'psychosocial_custom_name') || '';
            if (!customName && !hasAnyContent) return null;
            if (!customName && hasAnyContent) {
                return Object.assign({
                    item_type: 'custom',
                    item_key: panel.dataset.detailKey || '',
                    item_name: '',
                    psychosocial_custom_name: ''
                }, courseData, { note });
            }
            return Object.assign({
                item_type: 'custom',
                item_key: panel.dataset.detailKey || '',
                item_name: customName,
                psychosocial_custom_name: customName
            }, courseData, { note });
        }

        if (detailGroup.includes('psychosocial')) {
            return Object.assign({
                item_type: 'preset',
                item_key: panel.dataset.detailKey || '',
                item_name: itemLabel,
                orientation: itemLabel,
                orientation_other: otherInput?.value || '',
                formats: collectFieldValueByScope(panel, 'psychosocial_formats') || [],
                formats_other: collectOtherTextByScope(panel, 'psychosocial_formats')
            }, baseDose, courseData, { note });
        }

        return Object.assign({
            item_type: 'preset',
            item_key: panel.dataset.detailKey || '',
            item_name: medicationType || itemLabel,
            item: medicationType || itemLabel,
            item_other: otherInput?.value || medicationTypeOther || ''
        }, baseDose, courseData, { note });
    }

    function collectTreatment3aRow(card) {
        const selectedModes = collectFieldValueByScope(card, 'treatment_modes') || [];
        const showBiological = selectedModes.indexOf('生理治療') >= 0;
        const showPsychosocial = selectedModes.indexOf('心理社會治療') >= 0;
        const selectedBioTypes = showBiological ? (collectFieldValueByScope(card, 'bio_treatment_types') || []) : [];
        const rowData = {
            row_prefix: card.dataset.rowPrefix || '',
            template_kind: card.dataset.templateKind || 'treatment',
            topics: collectFieldValueByScope(card, 'topics') || [],
            topics_other: collectOtherTextByScope(card, 'topics') || '',
            execution_sites: collectFieldValueByScope(card, 'execution_sites') || [],
            execution_sites_other: collectOtherTextByScope(card, 'execution_sites') || '',
            treatment_modes: selectedModes,
            bio_treatment_types: selectedBioTypes,
            biological: showBiological ? {
                medication: [],
                non_medication: []
            } : null,
            psychosocial: []
        };

        Array.from(card.querySelectorAll('.treatment-detail-panel')).forEach(function (panel) {
            const detail = collectTreatment3aDetailData(panel);
            if (!detail) return;

            const group = panel.dataset.detailGroup || '';
            if (showBiological && rowData.biological && group === 'biological-medication' && selectedBioTypes.indexOf('藥物治療') >= 0) {
                rowData.biological.medication.push(detail);
            } else if (showBiological && rowData.biological && group === 'biological-non-medication' && selectedBioTypes.indexOf('非藥物治療') >= 0) {
                rowData.biological.non_medication.push(detail);
            } else if (showPsychosocial && (group === 'psychosocial' || group === 'psychosocial-custom')) {
                rowData.psychosocial.push(detail);
            }
        });

        return rowData;
    }

    function collectTreatment3bRow(card) {
        const selectedModes = collectFieldValueByScope(card, 'treatment_modes') || [];
        const showBiological = selectedModes.indexOf('生物治療') >= 0;
        const showPsychosocial = selectedModes.indexOf('心理社會治療') >= 0;
        const selectedBioItems = showBiological ? Array.from(new Set(collectFieldValueByScope(card, 'bio_treatment_items') || [])) : [];
        const rowData = {
            row_prefix: card.dataset.rowPrefix || '',
            template_kind: card.dataset.templateKind || 'treatment',
            topics: collectFieldValueByScope(card, 'topics') || [],
            topics_other: collectOtherTextByScope(card, 'topics') || '',
            execution_sites: collectFieldValueByScope(card, 'execution_sites') || [],
            execution_sites_other: collectOtherTextByScope(card, 'execution_sites') || '',
            treatment_modes: selectedModes,
            bio_treatment_items: selectedBioItems,
            biological: showBiological ? {
                medication: [],
                non_medication: []
            } : null,
            psychosocial: [],
            overall_note: collectFieldValueByScope(card, 'overall_note') || ''
        };

        Array.from(card.querySelectorAll('.treatment-detail-panel')).forEach(function (panel) {
            const detail = collectTreatment3aDetailData(panel);
            if (!detail) return;

            const key = panel.dataset.detailKey || '';
            const group = panel.dataset.detailGroup || '';
            if (showBiological && rowData.biological && group === '3b-biological') {
                if (key === 'psychiatric_medication' && selectedBioItems.indexOf('藥物治療') >= 0) {
                    rowData.biological.medication.push(detail);
                } else if (key === 'psychiatric_non_medication' && selectedBioItems.indexOf('非藥物治療') >= 0) {
                    rowData.biological.non_medication.push(detail);
                }
            } else if (showPsychosocial && (panel.dataset.psychosocialCustom === '1' || group === '3b-psychosocial' || group === 'psychosocial-custom')) {
                rowData.psychosocial.push(detail);
            }
        });

        return rowData;
    }

    function collectTreatment3cRow(card) {
        return {
            row_prefix: card.dataset.rowPrefix || '',
            template_kind: card.dataset.templateKind || 'treatment',
            topics: collectFieldValueByScope(card, 'topics') || [],
            topics_other: collectOtherTextByScope(card, 'topics') || '',
            execution_sites: collectFieldValueByScope(card, 'execution_sites') || [],
            execution_sites_other: collectOtherTextByScope(card, 'execution_sites') || '',
            open_description: collectFieldValueByScope(card, 'open_description') || ''
        };
    }

    function collectSection4Data() {
        const result = [];

        function collectLegacyTableRows(section) {
            const rows = [];
            section.querySelectorAll('tbody tr').forEach(function (tr) {
                const rowData = {};

                tr.querySelectorAll('input, select, textarea').forEach(function (field, index) {
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

            return rows;
        }

        document.querySelectorAll('.dynamic-section').forEach(section => {
            const matrixId = section.getAttribute('data-matrix-id');
            const title = section.querySelector('h3')?.textContent.trim() || '';

            let rows = [];
            const cards = Array.from(section.querySelectorAll('.service-row-card, .treatment-card'));

            if (cards.length > 0) {
                rows = cards.map(function (card) {
                    if (matrixId === 'matrix-3a') {
                        return collectTreatment3aRow(card);
                    }
                    if (matrixId === 'matrix-3b') {
                        return collectTreatment3bRow(card);
                    }
                    if (matrixId === 'matrix-3c') {
                        return collectTreatment3cRow(card);
                    }
                    const rowData = {};
                    rowData.row_prefix = card.dataset.rowPrefix || '';
                    rowData.template_kind = card.dataset.templateKind || '';
                    const fieldNames = Array.from(new Set(
                        Array.from(card.querySelectorAll('[data-field]'))
                            .map(field => field.dataset.field)
                            .filter(Boolean)
                    ));

                    fieldNames.forEach(function (fieldName) {
                        rowData[fieldName] = collectFieldValueByScope(card, fieldName);
                        const otherText = collectOtherTextByScope(card, fieldName);
                        if (otherText) {
                            rowData[`${fieldName}_other`] = otherText;
                        }
                    });

                    const standaloneNote = card.querySelector('textarea:not([data-field]), input:not([data-field])');
                    if (standaloneNote && Object.keys(rowData).length === 0) {
                        rowData.note = standaloneNote.value || '';
                    }

                    return rowData;
                });
            } else {
                rows = collectLegacyTableRows(section);

                const simpleSections = Array.from(section.querySelectorAll('[data-simple-section="1"]'));
                if (rows.length === 0 && simpleSections.length > 0) {
                    rows = simpleSections.map(function (scope) {
                        return collectScopeData(scope);
                    });
                }
            }

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

            return Array.from(container.querySelectorAll('.section5-detail-card')).map(function (card) {
                if (typeof window.collectSection5CardData === 'function') {
                    const data = window.collectSection5CardData(card);
                    delete data.use_contexts_map;
                    delete data.stage_frequency_map;
                    delete data.applicable_contexts;
                    return data;
                }
                return {};
            });
        }

        return {
            scale_tools: collectCards('section5-scale-tool-detail-container'),
            substance_tests: collectCards('section5-substance-test-detail-container'),
            medical_assessments: collectCards('section5-medical-assessment-detail-container')
        };
    }

    function collectRowByFieldNames(row, fieldNames) {
        const result = {};

        fieldNames.forEach(function (fieldName) {
            const field = row.querySelector(`[data-field="${fieldName}"]`);

            if (!field) {
                result[fieldName] = '';
                return;
            }

            if (field.type === 'checkbox') {
                result[fieldName] = field.checked;
                return;
            }

            result[fieldName] = field.value || '';
        });

        return result;
    }

    function collectSection6Data() {
        function collectRows(tbodyId, fieldNames) {
            const tbody = document.getElementById(tbodyId);
            if (!tbody) return [];

            return Array.from(tbody.querySelectorAll('tr'))
                .map(function (row) {
                    return collectRowByFieldNames(row, fieldNames);
                })
                .filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        const value = row[key];
                        if (Array.isArray(value)) return value.length > 0;
                        return String(value || '').trim() !== '';
                    });
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
                'related_section3_position',
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

    function getSection4ServiceOptions() {
        const services = [];

        document.querySelectorAll('.dynamic-section[data-matrix-id]').forEach(function (section) {
            const title = section.querySelector('h3')?.textContent.trim() || section.querySelector('.section-title')?.textContent.trim() || '';

            section.querySelectorAll('.service-row-card, .treatment-card').forEach(function (card) {
                const serviceSelect = card.querySelector('select[data-field="service_item"]');
                const serviceOtherInput = card.querySelector('[data-other-for="service_item"]');
                const selected = (serviceSelect?.value || '').trim();
                const otherText = serviceOtherInput?.value?.trim() || '';
                const detailPanels = Array.from(card.querySelectorAll('.treatment-detail-panel'));

                if (detailPanels.length > 0) {
                    detailPanels.forEach(function (panel) {
                        const toggleField = panel.dataset.toggleField || '';
                        const toggle = toggleField ? panel.querySelector(`[data-field="${toggleField}"]`) : null;
                        if (!toggle || !toggle.checked) return;

                        const detailGroup = panel.dataset.detailGroup || '';
                        const itemLabel = panel.dataset.itemLabel || toggle.value || '未命名服務項目';
                        const otherInput = panel.querySelector('[data-detail-other="1"]');
                        const otherValue = otherInput?.value?.trim() || '';
                        const groupLabelMap = {
                            'biological-medication': '生理治療-藥物治療',
                            'biological-non-medication': '生理治療-非藥物治療',
                            'psychosocial': '心理社會治療'
                        };
                        const detailParts = [
                            title,
                            groupLabelMap[detailGroup] || '3a 細項',
                            otherValue ? `${itemLabel}：${otherValue}` : itemLabel
                        ].filter(Boolean);

                        services.push({
                            id: panel.dataset.detailPrefix || card.dataset.rowPrefix || `service-${services.length + 1}`,
                            label: detailParts.join('｜'),
                            matrix_id: section.dataset.matrixId || '',
                            row_prefix: card.dataset.rowPrefix || '',
                            detail_prefix: panel.dataset.detailPrefix || '',
                            detail_group: detailGroup,
                            detail_key: panel.dataset.detailKey || '',
                            service_item: itemLabel,
                            service_item_other: otherValue
                        });
                    });
                    return;
                }

                const topicValues = Array.from(card.querySelectorAll('[data-field="topics"]'))
                    .filter(function (field) { return field.type === 'checkbox' && field.checked; })
                    .map(function (field) { return field.value || ''; })
                    .filter(Boolean);
                const methodValues = Array.from(card.querySelectorAll('[data-field="execution_methods"]'))
                    .filter(function (field) { return field.type === 'checkbox' && field.checked; })
                    .map(function (field) { return field.value || ''; })
                    .filter(Boolean);
                const displayItem = selected
                    ? (selected === '其他' ? (otherText || '其他') : selected)
                    : (topicValues[0] || methodValues[0] || '未命名服務項目');
                const rowPrefix = card.dataset.rowPrefix || '';

                services.push({
                    id: rowPrefix || `service-${services.length + 1}`,
                    label: title ? `${title}｜${displayItem}` : displayItem,
                    matrix_id: section.dataset.matrixId || '',
                    row_prefix: rowPrefix,
                    service_item: selected,
                    service_item_other: otherText
                });
            });
        });

        return services;
    }

    function buildVisitServiceGrid(rowPrefix, services, selectedLabels) {
        return createCompactChoiceGroup({
            type: 'checkbox',
            field: 'included_services',
            rowPrefix,
            options: services.map(function (service) {
                return {
                    text: service.label,
                    value: service.label,
                    selected: selectedLabels.includes(service.label)
                };
            }),
            className: 'visit-service-list',
            labelClass: 'compact-option'
        });
    }

    function createVisitCard(rowPrefix, services) {
        const card = createCardShell('visit-card');
        card.dataset.visitRowPrefix = rowPrefix;

        const deleteBtn = createCardDeleteButton(function () {
            const container = document.getElementById('visit-card-container');
            if (!container) return;
            const cards = container.querySelectorAll('.visit-card');
            if (cards.length > 1) {
                card.remove();
            } else {
                alert('請至少保留一個 Visit。');
            }
        });
        card.appendChild(deleteBtn);

        const body = document.createElement('div');
        body.className = 'space-y-4';

        body.appendChild(createFieldGroup('Visit 名稱', createFieldText('visit_name', rowPrefix, '例如：初評', 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none')));

        body.appendChild(createFieldGroup('Visit 順序', (function () {
            const line = document.createElement('div');
            line.className = 'flex flex-wrap items-center gap-2';
            line.appendChild(createFieldNumber('visit_order', rowPrefix, '', 'w-24 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })()));

        body.appendChild(createFieldGroup('距離前一次 Visit 的時間間隔', (function () {
            const line = document.createElement('div');
            line.className = 'compact-frequency';
            line.appendChild(createFieldNumber('interval_value', rowPrefix, '', 'compact-frequency-number w-20 border border-gray-300 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            line.appendChild(createFieldSelect('interval_unit', rowPrefix, [
                { value: '日', text: '日' },
                { value: '週', text: '週' },
                { value: '月', text: '月' }
            ], 'compact-frequency-unit inline-select border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none'));
            return line;
        })()));

        const serviceHolder = document.createElement('div');
        serviceHolder.dataset.visitServiceHolder = '1';
        serviceHolder.appendChild(buildVisitServiceGrid(rowPrefix, services, []));
        body.appendChild(createFieldGroup('包含的第四區塊服務項目', serviceHolder));

        body.appendChild(createFieldGroup('Visit 屬性', createFieldSelect('visit_type', rowPrefix, [
            { value: '', text: '-- 請選擇 --', selected: true },
            { value: '必要', text: '必要' },
            { value: '選擇性', text: '選擇性' },
            { value: '依個案狀況', text: '依個案狀況' }
        ], 'w-full border border-gray-300 rounded px-2 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none')));

        body.appendChild(createFieldGroup('補充說明', createFieldTextarea('note', rowPrefix, '請補充說明', 'w-full min-h-[48px] resize-none border border-gray-300 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none')));

        card.appendChild(body);
        bindAutoResizeInScope(card);
        return card;
    }

    function renderSection8() {
        const cardContainer = document.getElementById('visit-card-container');
        const ganttContainer = document.getElementById('visit-gantt-container');
        if (!cardContainer || !ganttContainer) return;
        if (cardContainer.dataset.initialized === '1') return;
        cardContainer.dataset.initialized = '1';

        let visitCount = 0;

        function buildCards() {
            const services = getSection4ServiceOptions();
            const existingCards = Array.from(cardContainer.querySelectorAll('.visit-card'));
            existingCards.forEach(function (card) {
                const holder = card.querySelector('[data-visit-service-holder]');
                if (!holder) return;
                const selectedLabels = Array.from(card.querySelectorAll('input[type="checkbox"][data-field="included_services"]:checked'))
                    .map(function (input) { return input.value; });
                while (holder.firstChild) holder.removeChild(holder.firstChild);
                holder.appendChild(buildVisitServiceGrid(card.dataset.visitRowPrefix || '', services, selectedLabels));
            });
        }

        function addVisitCard() {
            visitCount += 1;
            const rowPrefix = `visit_row_${visitCount}`;
            const services = getSection4ServiceOptions();
            const card = createVisitCard(rowPrefix, services);
            cardContainer.appendChild(card);
            bindAutoResizeInScope(card);
        }

        function collectVisitCards() {
            return Array.from(cardContainer.querySelectorAll('.visit-card')).map(function (card, index) {
                const rowPrefix = card.dataset.visitRowPrefix || '';
                const valuesOf = function (fieldName) {
                    const field = card.querySelector(`[data-field="${fieldName}"]`);
                    return field?.value || '';
                };
                const includedServices = Array.from(card.querySelectorAll('input[type="checkbox"][data-field="included_services"]:checked'))
                    .map(function (input) { return input.value; });
                return {
                    row_prefix: rowPrefix,
                    visit_name: valuesOf('visit_name'),
                    visit_order: valuesOf('visit_order') || String(index + 1),
                    interval_value: valuesOf('interval_value'),
                    interval_unit: valuesOf('interval_unit'),
                    included_services: includedServices,
                    visit_type: valuesOf('visit_type'),
                    note: valuesOf('note')
                };
            });
        }

        function renderGantt() {
            while (ganttContainer.firstChild) ganttContainer.removeChild(ganttContainer.firstChild);

            const visits = collectVisitCards()
                .filter(function (visit) {
                    return visit.visit_name || visit.visit_order || visit.included_services.length || visit.note;
                })
                .sort(function (a, b) {
                    const aOrder = Number(a.visit_order) || 0;
                    const bOrder = Number(b.visit_order) || 0;
                    return aOrder - bOrder;
                });

            if (!visits.length) {
                const empty = document.createElement('p');
                empty.className = 'gantt-empty';
                empty.textContent = '尚未填入足夠的 Visit 資料，請先新增 Visit 再產生甘特圖。';
                ganttContainer.appendChild(empty);
                return;
            }

            const chart = document.createElement('div');
            chart.className = 'gantt-chart';

            const scale = visits.reduce(function (sum, visit, index) {
                if (index === 0) return sum + 1;
                const value = Number(visit.interval_value) || 0;
                const unit = visit.interval_unit || '日';
                const unitScale = unit === '週' ? 7 : unit === '月' ? 30 : 1;
                return sum + Math.max(value * unitScale, 1);
            }, 0) || 1;

            let offset = 0;
            visits.forEach(function (visit, index) {
                const row = document.createElement('div');
                row.className = 'gantt-row';

                const label = document.createElement('div');
                label.className = 'gantt-label';
                const visitName = visit.visit_name || `Visit ${index + 1}`;
                const visitType = visit.visit_type ? ` · ${visit.visit_type}` : '';
                label.textContent = `${visit.visit_order || index + 1}. ${visitName}${visitType}`;

                const servicesText = document.createElement('div');
                servicesText.className = 'text-xs text-slate-500 mt-1';
                servicesText.textContent = visit.included_services.length ? `包含：${visit.included_services.join('、')}` : '尚未選擇服務項目';
                label.appendChild(servicesText);

                const track = document.createElement('div');
                track.className = 'gantt-track';

                const bar = document.createElement('div');
                bar.className = 'gantt-bar';
                const width = Math.max(14, Math.min(30, 100 / Math.max(visits.length + 1, 4)));
                const left = Math.min(100 - width, (offset / scale) * 100);
                bar.style.left = `${left}%`;
                bar.style.width = `${width}%`;
                bar.textContent = visitName;
                track.appendChild(bar);

                row.appendChild(label);
                row.appendChild(track);
                chart.appendChild(row);

                if (index > 0) {
                    const intervalValue = Number(visit.interval_value) || 0;
                    const intervalUnit = visit.interval_unit || '日';
                    const unitScale = intervalUnit === '週' ? 7 : intervalUnit === '月' ? 30 : 1;
                    offset += Math.max(intervalValue * unitScale, 1);
                }
            });

            ganttContainer.appendChild(chart);
        }

        const addBtn = document.getElementById('add-visit-btn');
        const refreshBtn = document.getElementById('refresh-visit-service-list-btn');
        const ganttBtn = document.getElementById('generate-gantt-btn');

        if (addBtn) {
            addBtn.addEventListener('click', function () {
                addVisitCard();
            });
        }

        if (refreshBtn) {
            refreshBtn.addEventListener('click', function () {
                buildCards();
            });
        }

        if (ganttBtn) {
            ganttBtn.addEventListener('click', function () {
                renderGantt();
            });
        }

        addVisitCard();
    }

    function collectSection8Data() {
        const cardContainer = document.getElementById('visit-card-container');
        if (!cardContainer) return [];

        return Array.from(cardContainer.querySelectorAll('.visit-card')).map(function (card, index) {
            const valueOf = function (fieldName) {
                return card.querySelector(`[data-field="${fieldName}"]`)?.value || '';
            };

            return {
                row_prefix: card.dataset.visitRowPrefix || '',
                visit_name: valueOf('visit_name'),
                visit_order: valueOf('visit_order') || String(index + 1),
                interval_value: valueOf('interval_value'),
                interval_unit: valueOf('interval_unit'),
                included_services: Array.from(card.querySelectorAll('input[type="checkbox"][data-field="included_services"]:checked'))
                    .map(function (input) { return input.value; }),
                visit_type: valueOf('visit_type'),
                note: valueOf('note')
            };
        });
    }

    function collectCompletionApprovalData() {
        function valueOf(fieldName) {
            return document.querySelector(
                `[data-field="${fieldName}"]`
            )?.value || '';
        }

        return {
            inventory_prepared_by:
                valueOf('inventory_prepared_by'),

            program_reviewer:
                valueOf('program_reviewer'),

            inventory_date:
                valueOf('inventory_date')
        };
    }

    function collectInventoryJson() {
        return {
            schema_version: '20s',
            exported_at: new Date().toISOString(),

            section1_program_basic_info: collectSection1Data(),
            section2_target_population: collectSection2Data(),
            section3_program_foundation_scope: collectSection3Data(),
            section4_program_service_planning: collectSection4Data(),
            section5_measurement_monitoring: collectSection5Data(),
            section6_staffing_composition: collectSection6Data(),
            section7_workforce_sustainability: collectSection7Data(),
            section8_visit_timeline: collectSection8Data(),
            completion_approval: collectCompletionApprovalData()
        };
    }

    function getHospitalShortName(hospitalName) {
        const map = {
            '國立成功大學醫學院附設醫院': '成大',
            '高雄市立凱旋醫院': '凱旋',
            '臺北市立聯合醫院松德院區': '北市聯醫',
            '奇美醫療財團法人奇美醫院': '奇美',
            '衛生福利部嘉南療養院': '嘉療',
            '衛生福利部草屯療養院': '草療',
            '衛生福利部桃園療養院': '桃療',
            '衛生福利部玉里醫院': '部玉'
        };
        return map[hospitalName] || hospitalName || '未命名院所';
    }

    function sanitizeExportName(text) {
        return stripBracketSegments(text || '')
            .replace(/[\\/:*?"<>|【】〔〕［］（）()\[\]{}、，。；：！？!@#$%^&+=`~\s]/g, '')
            .replace(/[^\u4e00-\u9fffA-Za-z0-9_-]/g, '');
    }

    function buildExportBaseName() {
        const agency = document.getElementById('operating-agency')?.value || '';
        const program = document.getElementById('program-name')?.value || '';
        const dateText = new Date();
        const yyyy = String(dateText.getFullYear());
        const mm = String(dateText.getMonth() + 1).padStart(2, '0');
        const dd = String(dateText.getDate()).padStart(2, '0');
        const datePart = `${yyyy}${mm}${dd}`;
        const agencyPart = getHospitalShortName(agency);
        const programPart = sanitizeExportName(program) || '未命名方案';
        return `${agencyPart}_${programPart}_${datePart}`;
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

    function hasIncompleteOtherSelection(scope) {
        const warnings = [];

        Array.from((scope || document).querySelectorAll('label')).forEach(function (labelNode) {
            const choice = labelNode.querySelector('input[type="checkbox"], input[type="radio"]');
            const textInput = labelNode.querySelector('input[type="text"]');
            if (!choice || !textInput || !choice.checked) return;
            if (!/其他/.test(labelNode.textContent || '')) return;
            if ((textInput.value || '').trim()) return;
            const fieldName = choice.dataset.field || choice.name || choice.value || '其他';
            warnings.push(`「${fieldName}」已勾選其他，但尚未補充說明`);
        });

        Array.from((scope || document).querySelectorAll('input[type="text"][data-other-for]')).forEach(function (input) {
            if (input.disabled || input.classList.contains('hidden') || input.offsetParent === null) return;
            if ((input.value || '').trim()) return;
            const fieldName = input.dataset.otherFor || '其他';
            const linked = (scope || document).querySelector(`[data-field="${fieldName}"]:checked`);
            if (linked) {
                warnings.push(`「${fieldName}」已啟用其他，但尚未補充說明`);
            }
        });

        return warnings;
    }

    function hasAnyFilledField(scope, fieldNames) {
        return fieldNames.some(function (fieldName) {
            const value = collectFieldValueByScope(scope, fieldName);
            if (Array.isArray(value)) return value.length > 0;
            return !!String(value || '').trim();
        });
    }

    function validateBeforeJsonExport() {
        const warnings = [];
        const operatingAgency = (document.getElementById('operating-agency') || {}).value || '';
        const programName = (document.getElementById('program-name') || {}).value || '';

        if (!operatingAgency) warnings.push('未選擇執行／營運單位');
        if (!programName) warnings.push('未選擇計畫方案名稱');
        if (!document.querySelector('.matrix-checkbox:checked')) warnings.push('第三區塊尚未勾選任何方案定位');

        warnings.push.apply(warnings, hasIncompleteOtherSelection(document));

        document.querySelectorAll('#section-block-matrix-3a .treatment-card').forEach(function (card, index) {
            const rowLabel = `3a 第 ${index + 1} 筆`;
            const selectedModes = collectFieldValueByScope(card, 'treatment_modes') || [];
            const bioTypes = collectFieldValueByScope(card, 'bio_treatment_types') || [];
            if (selectedModes.indexOf('生理治療') >= 0 && bioTypes.length === 0) {
                warnings.push(`${rowLabel} 已勾生理治療，但未勾藥物或非藥物治療`);
            }
            if (selectedModes.indexOf('心理社會治療') >= 0) {
                const presetChecked = card.querySelectorAll('input[type="checkbox"][data-field="psychosocial_orientations"]:checked').length;
                const customCards = Array.from(card.querySelectorAll('[data-psychosocial-custom="1"]'));
                const validCustom = customCards.some(function (customCard) {
                    return !!String(collectFieldValueByScope(customCard, 'psychosocial_custom_name') || '').trim();
                });
                if (!presetChecked && !validCustom) {
                    warnings.push(`${rowLabel} 已勾心理社會治療，但沒有任何預設或自訂治療項目`);
                }
                customCards.forEach(function (customCard) {
                    const name = collectFieldValueByScope(customCard, 'psychosocial_custom_name') || '';
                    const hasOtherContent = hasAnyFilledField(customCard, ['course_mode', 'course_duration_value', 'frequency_count', 'frequency_period_unit', 'minutes_per_session', 'note']);
                    if (!String(name).trim() && hasOtherContent) {
                        warnings.push(`${rowLabel} 自訂心理社會治療項目名稱空白`);
                    }
                });
            }
            card.querySelectorAll('.treatment-detail-panel').forEach(function (panel) {
                const mode = collectFieldValueByScope(panel, 'course_mode') || '';
                if (mode === 'limited' && !(collectFieldValueByScope(panel, 'course_duration_value') || '')) {
                    warnings.push(`${rowLabel} 有限期程但未填期程長度`);
                }
            });
        });

        document.querySelectorAll('#section-block-matrix-3b .treatment-card').forEach(function (card, index) {
            const rowLabel = `3b 第 ${index + 1} 筆`;
            const selectedModes = collectFieldValueByScope(card, 'treatment_modes') || [];
            const bioItems = collectFieldValueByScope(card, 'bio_treatment_items') || [];
            if (selectedModes.indexOf('生物治療') >= 0 && bioItems.length === 0) {
                warnings.push(`${rowLabel} 已勾生物治療，但未勾藥物或非藥物治療`);
            }
            if (selectedModes.indexOf('心理社會治療') >= 0) {
                const customCards = Array.from(card.querySelectorAll('[data-psychosocial-custom="1"]'));
                const validCustom = customCards.some(function (customCard) {
                    return !!String(collectFieldValueByScope(customCard, 'psychosocial_custom_name') || '').trim();
                });
                if (!validCustom) {
                    warnings.push(`${rowLabel} 已勾心理社會治療，但沒有有效的自訂項目`);
                }
                customCards.forEach(function (customCard) {
                    const name = collectFieldValueByScope(customCard, 'psychosocial_custom_name') || '';
                    const hasOtherContent = hasAnyFilledField(customCard, ['course_mode', 'course_duration_value', 'frequency_count', 'frequency_period_unit', 'minutes_per_session', 'note']);
                    if (!String(name).trim() && hasOtherContent) {
                        warnings.push(`${rowLabel} 自訂心理社會治療項目名稱空白`);
                    }
                });
            }
            card.querySelectorAll('.treatment-detail-panel').forEach(function (panel) {
                const mode = collectFieldValueByScope(panel, 'course_mode') || '';
                if (mode === 'limited' && !(collectFieldValueByScope(panel, 'course_duration_value') || '')) {
                    warnings.push(`${rowLabel} 有限期程但未填期程長度`);
                }
            });
        });

        document.querySelectorAll('#section5-substance-test-detail-container .section5-detail-card').forEach(function (card) {
            const itemName = card.dataset.itemLabel || card.dataset.itemId || '5B 項目';
            const paradigms = [];
            card.querySelectorAll('input[type="checkbox"][data-field="test_paradigm"]:checked').forEach(function (input) {
                paradigms.push(input.value);
            });
            if (paradigms.indexOf('screening') >= 0 && !card.querySelector('input[type="checkbox"][data-field="screening_specimens"]:checked')) {
                warnings.push(`5B「${itemName}」已勾篩檢，但未選篩檢檢體種類`);
            }
            if (paradigms.indexOf('confirmation') >= 0 && !card.querySelector('input[type="checkbox"][data-field="confirmation_specimens"]:checked')) {
                warnings.push(`5B「${itemName}」已勾確認，但未選確認檢體種類`);
            }
        });

        return Array.from(new Set(warnings));
    }

    function confirmExportWithWarnings(warnings) {
        if (!warnings.length) return true;

        const message = [
            `發現 ${warnings.length} 項可能尚未完成：`,
            '',
            ...warnings.map(function (item, index) {
                return `${index + 1}. ${item}`;
            }),
            '',
            '仍要匯出 JSON 嗎？'
        ].join('\n');

        return window.confirm(message);
    }

    const exportJsonBtn = document.getElementById('export-json-btn');

    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            const warnings = validateBeforeJsonExport();
            if (!confirmExportWithWarnings(warnings)) {
                return;
            }
            const data = collectInventoryJson();
            downloadJsonFile(data, `${buildExportBaseName()}.json`);
            markFormExported();
        });
    }
    const securePrintBtn = document.getElementById('secure-print-btn');

    if (securePrintBtn) {
        securePrintBtn.addEventListener('click', () => {
            document.title = buildExportBaseName();
            window.print();
        });
    }

    // ===== 修正結束：列印 / 匯出 PDF 按鈕，不變更資安設定 =====

    renderSection8();
    bindAutoResizeInScope(document);
});
