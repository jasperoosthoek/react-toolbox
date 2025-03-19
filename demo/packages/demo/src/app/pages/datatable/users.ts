export type User = {
	id: number;
	name: string;
	email: string;
	role: string;
	order: number;
}

const users = (
	[
    { "id": 1, "name": "John Smith", "email": "john.smith@example.com", "role": "Software Engineer", "order": 1},
    { "id": 2, "name": "Emily Johnson", "email": "emily.johnson@example.com", "role": "Project Manager", "order": 1,},
    { "id": 3, "name": "Liam O'Connor", "email": "liam.oconnor@example.com", "role": "UX Designer", "order": 2,},
    { "id": 4, "name": "Sofia Gonzalez", "email": "sofia.gonzalez@example.com", "role": "Marketing Manager", "order": 3,},
    { "id": 5, "name": "Daniel Kim", "email": "daniel.kim@example.com", "role": "Data Scientist", "order": 4,},
    { "id": 6, "name": "Isabelle Dupont", "email": "isabelle.dupont@example.com", "role": "HR Coordinator", "order": 5,},
    { "id": 7, "name": "Mohammed Ali", "email": "mohammed.ali@example.com", "role": "Backend Developer", "order": 6,},
    { "id": 8, "name": "Olga Petrov", "email": "olga.petrov@example.com", "role": "Financial Analyst", "order": 7,},
    { "id": 9, "name": "Carlos Mendes", "email": "carlos.mendes@example.com", "role": "QA Engineer", "order": 8,},
    { "id": 10, "name": "Hana Takahashi", "email": "hana.takahashi@example.com", "role": "Legal Advisor", "order": 9,},
    { "id": 11, "name": "Jacob Brown", "email": "jacob.brown@example.com", "role": "Software Engineer", "order": 10},
    { "id": 12, "name": "Anna Schmidt", "email": "anna.schmidt@example.com", "role": "Product Owner", "order": 11},
    { "id": 13, "name": "Ethan Miller", "email": "ethan.miller@example.com", "role": "DevOps Engineer", "order": 12},
    { "id": 14, "name": "Zara Ahmed", "email": "zara.ahmed@example.com", "role": "Business Analyst", "order": 13},
    { "id": 15, "name": "Lucas Moreau", "email": "lucas.moreau@example.com", "role": "Cybersecurity Specialist", "order": 14},
    { "id": 16, "name": "Nina Kowalski", "email": "nina.kowalski@example.com", "role": "Marketing Coordinator", "order": 15},
    { "id": 17, "name": "Oscar Rivera", "email": "oscar.rivera@example.com", "role": "Full Stack Developer", "order": 16},
    { "id": 18, "name": "Ming Wei", "email": "ming.wei@example.com", "role": "Data Engineer", "order": 17},
    { "id": 19, "name": "David Lee", "email": "david.lee@example.com", "role": "IT Manager", "order": 18},
    { "id": 20, "name": "Elena Vasquez", "email": "elena.vasquez@example.com", "role": "Customer Support Manager", "order": 19},
    { "id": 21, "name": "Tomás Silva", "email": "tomas.silva@example.com", "role": "Security Analyst", "order": 20},
    { "id": 22, "name": "Aisha Khan", "email": "aisha.khan@example.com", "role": "HR Manager", "order": 21},
    { "id": 23, "name": "Nathan Carter", "email": "nathan.carter@example.com", "role": "Software Architect", "order": 22},
    { "id": 24, "name": "Chloe Laurent", "email": "chloe.laurent@example.com", "role": "SEO Specialist", "order": 23},
    { "id": 25, "name": "William Harris", "email": "william.harris@example.com", "role": "AI Researcher", "order": 24},
    { "id": 26, "name": "Maria Rossi", "email": "maria.rossi@example.com", "role": "Social Media Manager", "order": 25},
    { "id": 27, "name": "Josef Novak", "email": "josef.novak@example.com", "role": "Database Administrator", "order": 26},
    { "id": 28, "name": "Yasmine El-Sayed", "email": "yasmine.elsayed@example.com", "role": "Copywriter", "order": 27},
    { "id": 29, "name": "Antonio Ferrara", "email": "antonio.ferrara@example.com", "role": "IT Consultant", "order": 28},
    { "id": 30, "name": "Daria Volkov", "email": "daria.volkov@example.com", "role": "Legal Consultant", "order": 29},
    { "id": 31, "name": "Alex Murphy", "email": "alex.murphy@example.com", "role": "Technical Writer", "order": 30},
    { "id": 32, "name": "Mei Lin", "email": "mei.lin@example.com", "role": "HR Associate", "order": 31},
    { "id": 33, "name": "Felipe Costa", "email": "felipe.costa@example.com", "role": "Embedded Systems Engineer", "order": 32},
    { "id": 34, "name": "Camille Dubois", "email": "camille.dubois@example.com", "role": "Customer Success Manager", "order": 33},
    { "id": 35, "name": "Haruto Nakamura", "email": "haruto.nakamura@example.com", "role": "Machine Learning Engineer", "order": 34},
    { "id": 36, "name": "Fatima Rahman", "email": "fatima.rahman@example.com", "role": "Community Manager", "order": 35},
    { "id": 37, "name": "Stefan Kovac", "email": "stefan.kovac@example.com", "role": "Frontend Developer", "order": 36},
    { "id": 38, "name": "Layla Hassan", "email": "layla.hassan@example.com", "role": "Scrum Master", "order": 37},
    { "id": 39, "name": "Rafael Ortega", "email": "rafael.ortega@example.com", "role": "Networking Engineer", "order": 38},
    { "id": 40, "name": "Veronika Müller", "email": "veronika.muller@example.com", "role": "HR Specialist", "order": 39},
    { "id": 41, "name": "Hugo Martins", "email": "hugo.martins@example.com", "role": "Blockchain Developer", "order": 40},
    { "id": 42, "name": "Selma Johansson", "email": "selma.johansson@example.com", "role": "Content Strategist", "order": 41},
    { "id": 43, "name": "Andrei Popescu", "email": "andrei.popescu@example.com", "role": "Game Developer", "order": 42},
    { "id": 44, "name": "Jasmine Patel", "email": "jasmine.patel@example.com", "role": "Data Analyst", "order": 43},
    { "id": 45, "name": "Luis Fernandez", "email": "luis.fernandez@example.com", "role": "Full Stack Developer", "order": 44},
    { "id": 46, "name": "Gabriela Mendes", "email": "gabriela.mendes@example.com", "role": "UX Researcher", "order": 45},
    { "id": 47, "name": "Jakub Nowak", "email": "jakub.nowak@example.com", "role": "Backend Engineer", "order": 46},
    { "id": 48, "name": "Clara Eriksson", "email": "clara.eriksson@example.com", "role": "Marketing Analyst", "order": 47},
    { "id": 49, "name": "Leonardo Batista", "email": "leonardo.batista@example.com", "role": "Cloud Engineer", "order": 48},
    { "id": 50, "name": "Saanvi Reddy", "email": "saanvi.reddy@example.com", "role": "Business Intelligence Specialist", "order": 49 }
  ] as User[]
)

export default users;
