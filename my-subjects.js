document.addEventListener("DOMContentLoaded", () => {
    const studentNameInput = document.getElementById("student-name-input");
    const saveNameBtn = document.getElementById("save-name-btn");
    const welcomeMsg = document.getElementById("welcome-msg");
    const subjectsContainer = document.getElementById("my-subjects-list");

    // בדיקה האם יש כבר שם שמור ב-localStorage
    let currentStudent = localStorage.getItem("studentName") || "";
    
    if (currentStudent) {
        studentNameInput.value = currentStudent;
        welcomeMsg.textContent = `שלום, ${currentStudent}`;
        loadMyEnrollments(currentStudent);
    }

    // שמירת השם ל-localStorage בעת לחיצה על כפתור
    saveNameBtn.addEventListener("click", () => {
        const name = studentNameInput.value.trim();
        if (name) {
            localStorage.setItem("studentName", name);
            welcomeMsg.textContent = `שלום, ${name}`;
            loadMyEnrollments(name);
        } else {
            alert("נא להזין שם תלמידה תקין");
        }
    });

    // פונקציה לשליפת ההרשמות מהשרת וסינון לפי שם התלמידה
    async function loadMyEnrollments(studentName) {
        try {
            subjectsContainer.innerHTML = "<p>טוען מקצועות...</p>";
            
            // שליפת כל ההרשמות מה-API
            const response = await fetch("/api/enrollments");
            if (!response.ok) {
                throw new Error("שגיאה בטעינת נתוני ההרשמה מהשרת");
            }
            
            const enrollments = await response.json();
            
            // סינון ההרשמות לפי השם של התלמידה הנוכחית
            const myEnrollments = enrollments.filter(item => 
                item.studentName === studentName || item.student === studentName
            );

            if (myEnrollments.length === 0) {
                subjectsContainer.innerHTML = "<p>עדיין לא נרשמת לאף מקצוע.</p>";
                return;
            }

            // הצגת המקצועות במסך
            subjectsContainer.innerHTML = "";
            myEnrollments.forEach(enrollment => {
                const card = document.createElement("div");
                card.className = "subject-card";
                card.innerHTML = `
                    <h3>${enrollment.subjectName || enrollment.subject || "מקצוע"}</h3>
                    <p>סטטוס: רשומה ✔</p>
                `;
                subjectsContainer.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            subjectsContainer.innerHTML = `<p style="color: red;">שגיאה: ${error.message}</p>`;
        }
    }
});
