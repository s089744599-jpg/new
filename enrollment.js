// הגדרת משתנה לשם התלמידה הנוכחית
let studentName = "תלמידה";

/**
 * פונקציה המאפשרת לעדכן את שם התלמידה הנוכחית במערכת
 * @param {string} name - שם התלמידה החדש
 */
function setStudentName(name) {
    if (name && name.trim() !== "") {
        studentName = name.trim();
    }
}

/**
 * פונקציה הבודקת האם התלמידה הנוכחית רשומה למקצוע מסוים
 * פונה לשרת בכתובת GET /api/enrollments
 * 
 * @param {string|number} subjectId - מזהה המקצוע לבדיקה
 * @returns {Promise<boolean>} - מחזיר true אם התלמידה רשומה, ו-false אחרת
 */
async function isEnrolled(subjectId) {
    try {
        const response = await fetch('/api/enrollments');
        
        if (!response.ok) {
            throw new Error('שגיאה בשליפת נתוני ההרשמות מהשרת');
        }
        
        const enrollments = await response.json();
        
        // חיפוש האם קיימת הרשמה המאמתת את שם התלמידה ומזהה המקצוע
        const enrollmentExists = enrollments.some(enrollment => 
            String(enrollment.subjectId) === String(subjectId) && 
            enrollment.studentName === studentName
        );
        
        return enrollmentExists;
    } catch (error) {
        console.error('שגיאה בבדיקת ההרשמה:', error);
        return false;
    }
}

/**
 * פונקציה המבצעת רישום של התלמידה למקצוע
 * שולחת בקשת POST לכתובת /api/enrollments עם מזהה המקצוע ושם התלמידה
 * 
 * @param {string|number} subjectId - מזהה המקצוע להרשמה
 * @param {string} [name] - שם התלמידה (אופציונלי, ישתמש בשם הגלובלי אם לא הועבר)
 * @returns {Promise<object|null>} - מחזיר את נתוני ההרשמה שנוצרו או null במקרה של שגיאה
 */
async function joinSubject(subjectId, name = studentName) {
    try {
        const response = await fetch('/api/enrollments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subjectId: subjectId,
                studentName: name
            })
        });

        if (!response.ok) {
            throw new Error('שגיאה בביצוע ההרשמה מול השרת');
        }

        const result = await response.json();
        console.log("ההרשמה בוצעה בהצלחה:", result);
        return result;
        
    } catch (error) {
        console.error('שגיאה בהצטרפות למקצוע:', error);
        alert('אירעה שגיאה בעת הניסיון להירשם למקצוע. נא לנסות שוב.');
        return null;
    }
}