// دالة تنظيف الحروف العربية والإنجليزية لضمان مطابقة مرنة
function normalizeInput(str) {
    if (!str) return '';
    return str.trim()
        .toLowerCase()
        .replace(/[أإآا]/g, 'ا') // تحويل كل الألفات لألف عادية
        .replace(/ة/g, 'ه')     // تحويل التاء المربوطة لـ هاء
        .replace(/\s+/g, '');   // إزالة أي مسافات بين الكلمات تماماً
}

// دالة التحقق من الإجابة لكل مستوى
function checkLevelAnswer(currentLevel, userInput) {
    const team = localStorage.getItem('selectedTeam'); // 'blue' أو 'red'
    const cleanInput = normalizeInput(userInput);

    if (team === 'blue') {
        switch (currentLevel) {
            case 1:
                return cleanInput === '11';
            case 2:
                // النص الأصلي للمرحلة 2 للفريق الأزرق (مثال)
                return cleanInput === normalizeInput('رصاحبملا عرلقا');
            case 3:
                return cleanInput === '220';
            case 4:
                // يقبل "الروتر" أو "الراوتر"
                return cleanInput === normalizeInput('الروتر') || cleanInput === normalizeInput('الراوتر');
            case 5:
                return cleanInput === 'sos';
            case 6:
                // الكود المدمج (ليفل 3 + ليفل 4 الأساسي "الكمبيوتر" + ليفل 5)
                return cleanInput === normalizeInput('220الكمبيوترsos') || cleanInput === normalizeInput('220الحاسوبsos');
            case 'twist': // الفخ النهائي (دقيقة واحدة)
                return cleanInput === '126';
            default:
                return false;
        }
    }

    if (team === 'red') {
        switch (currentLevel) {
            case 1:
                return cleanInput === '215';
            case 2:
                return cleanInput === normalizeInput('ةدحتملا زولما');
            case 3:
                return cleanInput === '900';
            case 4:
                // يقبل "العداد" أو "عداد الكهرباء"
                return cleanInput === normalizeInput('العداد') || cleanInput === normalizeInput('عداد الكهرباء');
            case 5:
                return cleanInput === normalizeInput('الاخضر');
            case 6:
                // الكود المدمج (ليفل 3 + ليفل 4 الأساسي "العداد" + ليفل 5)
                return cleanInput === normalizeInput('900العدادالاخضر') || cleanInput === normalizeInput('900عدادالكهرباءالاخضر');
            case 'twist': // الفخ النهائي (دقيقة واحدة)
                return cleanInput === '90';
            default:
                return false;
        }
    }

    return false;
}

// مثال على طريقة الاستدعاء عند الضغط على زر التحقق
// const userInput = document.getElementById('level-input').value;
// if (checkLevelAnswer(4, userInput)) {
//     console.log('إجابة صحيحة! عاش يا وحش');
// } else {
//     console.log('غلط! فكر تاني أو استخدم كود الـ Hint');
// }
