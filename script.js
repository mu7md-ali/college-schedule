// كل البيانات - 16 سكشن مع الأوقات
const periodTimes = {
    "1-2": "9:15-10:45",
    "3-4": "10:55-12:25", 
    "5-6": "12:45-2:10",
    "7-8": "2:20-3:45"
};

const allSections = {
    // Group A - Sections 1-8
    "1": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"System Analysis 📊", t:"S", d:"T.A Esraa Ezzat", r:"Lab 103"}, 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}, 
                "7-8": {n:"Computer Network 🔌", t:"S", d:"T.A Esraa Safwat", r:"Lab 105"} 
            },
            "Tuesday": {
                "1-2": {n:"Web Programming 🌐", t:"S", d:"T.A Karen", r:"Lab 103 AI"},
                "5-6": {n:"Data Structure 🌳", t:"S", d:"T.A Asmaa Hassan", r:"Lab 105"}
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Thursday": {}
        }
    },
    "2": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "3-4": {n:"Web Programming 🌐", t:"S", d:"T.A Karen", r:"Lab 105"},
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"},
                "7-8": {n:"Computer Network 🔌", t:"S", d:"T.A Rowyda", r:"Lab 303"}
            },
            "Monday": { 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}, 
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Esraa Ezzat", r:"Lab 222 AI"} 
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"},
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Nadeen", r:"Lab 104"}
            },
            "Thursday": {}
        }
    },
    "3": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Computer Network 🔌", t:"S", d:"T.A Esraa Safwat", r:"Lab 105"}, 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}, 
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Asmaa Hassan", r:"Lab 101"} 
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "3-4": {n:"Web Programming 🌐", t:"S", d:"T.A Karen", r:"Lab 303"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"},
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Ethar", r:"Lab 101"}
            },
            "Thursday": {}
        }
    },
    "4": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}
            },
            "Tuesday": {
                "1-2": {n:"Data Structure 🌳", t:"S", d:"T.A Asmaa Hassan", r:"Lab 102"},
                "3-4": {n:"System Analysis 📊", t:"S", d:"T.A Ethar", r:"Lab 201 AI"},
                "5-6": {n:"Computer Network 🔌", t:"S", d:"T.A Rowyda", r:"Lab 002"}
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"},
                "7-8": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 103"}
            },
            "Thursday": {}
        }
    },
    "5": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 002"}, 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}, 
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Ethar", r:"Lab 205"} 
            },
            "Tuesday": {
                "3-4": {n:"Computer Network 🔌", t:"S", d:"T.A Rowyda", r:"Lab 218 AI"},
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Asmaa Hassan", r:"Lab 104"}
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Thursday": {}
        }
    },
    "6": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "3-4": {n:"System Analysis 📊", t:"S", d:"T.A Esraa Ezzat", r:"Lab 218 AI"},
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}, 
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Yoser", r:"Lab 104"} 
            },
            "Tuesday": {
                "1-2": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 203"},
                "7-8": {n:"Computer Network 🔌", t:"S", d:"T.A Reham", r:"Lab 303"}
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Thursday": {}
        }
    },
    "7": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}, 
                "7-8": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 203 AI"} 
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "3-4": {n:"Data Structure 🌳", t:"S", d:"T.A Yoser", r:"Lab 201 AI"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Thursday": {
                "1-2": {n:"System Analysis 📊", t:"S", d:"T.A Layla", r:"Lab 101"},
                "5-6": {n:"Computer Network 🔌", t:"S", d:"T.A Nadeem", r:"Lab 004"}
            }
        }
    },
    "8": {
        group: "A",
        data: {
            "Sunday": { 
                "1-2": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "3-4": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 002"},
                "5-6": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"S", d:"T.A Yoser", r:"Lab 104"}, 
                "3-4": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"}
            },
            "Wednesday": {
                "1-2": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Thursday": {
                "1-2": {n:"Computer Network 🔌", t:"S", d:"T.A Nadeen", r:"Lab 218 AI"},
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Layla", r:"Lab 218 AI"}
            }
        }
    },
    
    // Group B - Sections 9-16
    "9": {
        group: "B",
        data: {
            "Sunday": { 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 201 AI"},
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "3-4": {n:"Data Structure 🌳", t:"S", d:"T.A Yoser", r:"Lab 303"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Tuesday": {
                "5-6": {n:"Computer Network 🔌", t:"S", d:"T.A Reham", r:"Lab 203"},
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Layla", r:"Lab 201 AI"}
            },
            "Wednesday": {
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}
            },
            "Thursday": {}
        }
    },
    "10": {
        group: "B",
        data: {
            "Sunday": { 
                "1-2": {n:"Web Programming 🌐", t:"S", d:"T.A Asmaa Ghoniem", r:"Lab 105"},
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "3-4": {n:"Computer Network 🔌", t:"S", d:"T.A Nadeen", r:"Lab 002"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Tuesday": {
                "3-4": {n:"System Analysis 📊", t:"S", d:"T.A Layla", r:"Lab 101"},
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Reham", r:"Lab 102"}
            },
            "Wednesday": {
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}
            },
            "Thursday": {}
        }
    },
    "11": {
        group: "B",
        data: {
            "Sunday": { 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"},
                "7-8": {n:"Web Programming 🌐", t:"S", d:"T.A Salma Ayman", r:"Lab 303"}
            },
            "Tuesday": {
                "5-6": {n:"System Analysis 📊", t:"S", d:"T.A Layla", r:"Lab 104"},
                "7-8": {n:"Computer Network 🔌", t:"S", d:"T.A Salma Ayman", r:"Lab 203"}
            },
            "Wednesday": {
                "1-2": {n:"Data Structure 🌳", t:"S", d:"T.A Reham", r:"Lab 102"},
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}
            },
            "Thursday": {}
        }
    },
    "12": {
        group: "B",
        data: {
            "Sunday": { 
                "1-2": {n:"Web Programming 🌐", t:"S", d:"T.A Salma Ayman", r:"Lab 201 AI"}, 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Tuesday": {
                "1-2": {n:"Computer Network 🔌", t:"S", d:"T.A Salma Ayman", r:"Lab 101"},
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Howida", r:"Lab 218 AI"}
            },
            "Wednesday": {
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"},
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Rehab", r:"Lab 219 AI"}
            },
            "Thursday": {}
        }
    },
    "13": {
        group: "B",
        data: {
            "Sunday": { 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "3-4": {n:"Computer Network 🔌", t:"S", d:"T.A Salma Ayman", r:"Lab 105"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"},
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Rehab", r:"Lab 218 AI"}
            },
            "Wednesday": {
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}
            },
            "Thursday": {
                "3-4": {n:"System Analysis 📊", t:"S", d:"T.A Layla", r:"Lab 201 AI"},
                "5-6": {n:"Computer Network 🔌", t:"S", d:"T.A Salma Ayman", r:"Lab 102"}
            }
        }
    },
    "14": {
        group: "B",
        data: {
            "Sunday": { 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"Computer Network 🔌", t:"S", d:"T.A Salma Ayman", r:"Lab 203"},
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Wednesday": {
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"},
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Howida", r:"Lab 222 AI"}
            },
            "Thursday": {
                "1-2": {n:"Web Programming 🌐", t:"S", d:"T.A Salma Ayman", r:"Lab 105"},
                "7-8": {n:"Data Structure 🌳", t:"S", d:"T.A Nadeen", r:"Lab 219 AI"}
            }
        }
    },
    "15": {
        group: "B",
        data: {
            "Sunday": { 
                "1-2": {n:"Data Structure 🌳", t:"S", d:"T.A Nadeen", r:"Lab 303"}, 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "5-6": {n:"System Analysis 📊", t:"S", d:"T.A Howida", r:"Lab 105"},
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Wednesday": {
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}
            },
            "Thursday": {
                "1-2": {n:"Computer Network 🔌", t:"S", d:"T.A Salma Ayman", r:"Lab 104"},
                "5-6": {n:"Web Programming 🌐", t:"S", d:"T.A Salma Ayman", r:"Lab 102"}
            }
        }
    },
    "16": {
        group: "B",
        data: {
            "Sunday": { 
                "3-4": {n:"Business Administration 💼", t:"L", d:"Dr. Sameh Mohamed", r:"مدرج 1 إعلام"}, 
                "7-8": {n:"Computer Network 🔌", t:"L", d:"Dr. Hesham Abo el-fotoh", r:"مدرج 5 إعلام"} 
            },
            "Monday": { 
                "1-2": {n:"Data Structure 🌳", t:"L", d:"Dr. Osama Shafik", r:"مدرج 5 إعلام"}, 
                "3-4": {n:"Web Programming 🌐", t:"S", d:"T.A Karen", r:"Lab 201 AI"},
                "5-6": {n:"System Analysis 📊", t:"L", d:"Dr. Magdy Elhenawy", r:"مدرج 7 علوم حاسب"}
            },
            "Wednesday": {
                "1-2": {n:"Data Structure 🌳", t:"S", d:"T.A Nadeen", r:"Lab 104"},
                "3-4": {n:"Human Rights ⚖️", t:"L", d:"Dr. Ahmed Noaman", r:"مدرج 5 إعلام"},
                "5-6": {n:"Web Programming 🌐", t:"L", d:"Dr. Mohamed Mostafa", r:"مدرج 5 إعلام"}
            },
            "Thursday": {
                "3-4": {n:"Computer Network 🔌", t:"S", d:"T.A Nadeen", r:"Lab 004"},
                "7-8": {n:"System Analysis 📊", t:"S", d:"T.A Howida", r:"Lab 222 AI"}
            }
        }
    }
};

let currentSection = "1";
let originalContent = '';
let isEditing = false;
let isGroupView = false;
let currentGroup = null;

// Toast Notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    toast.innerHTML = `${icons[type]} ${message}`;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Change Section
function changeSection(sectionNum) {
    if(!sectionNum) return;
    
    currentSection = sectionNum;
    isGroupView = false;
    currentGroup = null;
    
    // Show section view, hide group view
    document.getElementById('sectionView').classList.remove('hidden');
    document.getElementById('groupView').classList.add('hidden');
    
    // Update buttons
    document.getElementById('groupABtn').classList.remove('hidden');
    document.getElementById('groupBBtn').classList.remove('hidden');
    document.getElementById('downloadBtn').classList.remove('hidden');
    document.getElementById('pdfBtn').classList.add('hidden');
    document.getElementById('backBtn').classList.add('hidden');
    
    const section = allSections[sectionNum];
    renderSectionTable(section.data, sectionNum);
    showToast(`Section ${sectionNum} Loaded`, 'success');
}

// Render Section Table
function renderSectionTable(data, sectionNum) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    const body = document.getElementById('tableBody');
    body.innerHTML = '';
    
    document.getElementById('tableTitle').innerText = `Section ${sectionNum}`;

    days.forEach((day, index) => {
        let row = document.createElement('tr');
        row.className = 'day-row';
        row.style.animationDelay = `${index * 0.05}s`;
        
        row.innerHTML = `<td class="font-black text-white/50 text-[10px] sm:text-[11px] pr-2 sm:pr-4 align-middle uppercase tracking-wider">${day}</td>`;
        
        periods.forEach(p => {
            const cell = data[day] ? data[day][p] : null;
            if(cell) {
                const roomHtml = cell.r.replace(/AI/g, '<span class="ai-highlight">AI</span>');
                const isLecture = cell.t === 'L';
                row.innerHTML += `
                    <td>
                        <div class="${isLecture ? 'lecture-card' : 'lab-card'}" onclick="showDetails('${day}', '${p}', '${sectionNum}')">
                            <div class="font-black text-[9px] sm:text-[11px] mb-1 leading-tight text-white text-center">${cell.n}</div>
                            <div class="text-[7px] sm:text-[9px] font-bold text-white/60 mb-1 text-center">${cell.d}</div>
                            <div class="room-text">${roomHtml}</div>
                        </div>
                    </td>
                `;
            } else {
                row.innerHTML += `
                    <td>
                        <div class="empty-cell"></div>
                    </td>
                `;
            }
        });
        
        body.appendChild(row);
    });
}

// Show Group Schedule
function showGroupSchedule(group) {
    isGroupView = true;
    currentGroup = group;
    
    // Hide section view, show group view
    document.getElementById('sectionView').classList.add('hidden');
    document.getElementById('groupView').classList.remove('hidden');
    
    // Update buttons
    document.getElementById('groupABtn').classList.add('hidden');
    document.getElementById('groupBBtn').classList.add('hidden');
    document.getElementById('downloadBtn').classList.add('hidden');
    document.getElementById('pdfBtn').classList.remove('hidden');
    document.getElementById('backBtn').classList.remove('hidden');
    
    // Update select
    document.getElementById('sectionSelect').value = "";
    
    renderGroupTable(group);
    showToast(`Group ${group} Schedule Loaded`, 'success');
}

// Render Group Table
function renderGroupTable(group) {
    const sections = group === 'A' ? ['1','2','3','4','5','6','7','8'] : ['9','10','11','12','13','14','15','16'];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
    
    document.getElementById('groupTitle').innerText = `Group ${group} Schedule`;
    
    const tbody = document.getElementById('groupTableBody');
    tbody.innerHTML = '';
    
    sections.forEach((secNum, index) => {
        const sec = allSections[secNum];
        const tr = document.createElement('tr');
        tr.style.animationDelay = `${index * 0.05}s`;
        
        // Section header
        const th = document.createElement('th');
        th.className = `section-header ${sec.group === 'B' ? 'group-b' : ''}`;
        th.innerText = `SEC ${secNum.padStart(2, '0')}`;
        tr.appendChild(th);
        
        // Days
        days.forEach(day => {
            const td = document.createElement('td');
            td.className = 'period-cell';
            
            if (sec.data[day]) {
                const periods = Object.keys(sec.data[day]).sort();
                periods.forEach(period => {
                    const cell = sec.data[day][period];
                    const time = periodTimes[period];
                    const isLab = cell.t === 'S';
                    
                    const miniCard = document.createElement('div');
                    miniCard.className = `mini-card ${isLab ? 'lab' : ''}`;
                    miniCard.onclick = () => showDetails(day, period, secNum);
                    
                    miniCard.innerHTML = `
                        <div class="mini-time">${period} | ${time}</div>
                        <div class="mini-subject">${cell.n}</div>
                        <div class="mini-doctor">${cell.d}</div>
                        <div class="mini-room">${cell.r.replace(/AI/g, '<span style="color:#22d3ee;text-shadow:0 0 10px #22d3ee">AI</span>')}</div>
                    `;
                    
                    td.appendChild(miniCard);
                });
            } else {
                td.innerHTML = '<div class="empty-slot">— Free —</div>';
            }
            
            tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
    });
}

// Back to Section View
function backToSection() {
    changeSection(currentSection);
}

// Show Details
function showDetails(day, period, sectionNum) {
    if(isEditing) return;
    
    const cell = allSections[sectionNum].data[day][period];
    if(cell) {
        showToast(`${cell.n} | ${cell.d} | ${cell.r}`, 'info');
    }
}

// Enable Editing
function enableEditing() {
    isEditing = true;
    const captureArea = isGroupView ? document.getElementById('groupView') : document.getElementById('captureArea');
    originalContent = captureArea.innerHTML;
    
    captureArea.contentEditable = "true";
    document.getElementById('editModeBtn').classList.add('hidden');
    document.getElementById('confirmBtn').classList.remove('hidden');
    document.getElementById('cancelBtn').classList.remove('hidden');
    
    showToast('Edit Mode Enabled! Click any text to edit', 'info');
}

// Disable Editing
function disableEditing(save) {
    isEditing = false;
    const captureArea = isGroupView ? document.getElementById('groupView') : document.getElementById('captureArea');
    
    if(!save) {
        captureArea.innerHTML = originalContent;
        showToast('Changes Discarded', 'error');
    } else {
        showToast('Changes Saved Successfully!', 'success');
    }
    
    captureArea.contentEditable = "false";
    document.getElementById('editModeBtn').classList.remove('hidden');
    document.getElementById('confirmBtn').classList.add('hidden');
    document.getElementById('cancelBtn').classList.add('hidden');
}

// Download Table (PNG)
function downloadTable() {
    const area = document.getElementById('captureArea');
    
    const buttons = document.querySelectorAll('.action-btn, .header-link, select');
    buttons.forEach(btn => btn.style.opacity = '0');
    
    showToast('Generating Image...', 'info');
    
    html2canvas(area, { 
        backgroundColor: '#0a0a0a', 
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = `CS_Schedule_Section_${currentSection}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        
        buttons.forEach(btn => btn.style.opacity = '1');
        showToast('Downloaded Successfully!', 'success');
    }).catch(err => {
        buttons.forEach(btn => btn.style.opacity = '1');
        showToast('Download Failed', 'error');
        console.error(err);
    });
}

// Download Group PDF
function downloadGroupPDF() {
    const { jsPDF } = window.jspdf;
    
    showToast('Generating PDF... This may take a moment', 'info');
    
    // Hide buttons temporarily
    const buttons = document.querySelectorAll('.action-btn, .header-link, select');
    buttons.forEach(btn => btn.style.opacity = '0');
    
    const element = document.getElementById('groupView');
    
    html2canvas(element, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // Calculate PDF dimensions
        const imgWidth = 297; // A4 landscape width in mm
        const pageHeight = 210; // A4 landscape height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pdf = new jsPDF('l', 'mm', 'a4');
        
        let heightLeft = imgHeight;
        let position = 0;
        
        // Add first page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // Add more pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`CS_Schedule_Group_${currentGroup}.pdf`);
        
        buttons.forEach(btn => btn.style.opacity = '1');
        showToast('PDF Downloaded Successfully!', 'success');
    }).catch(err => {
        buttons.forEach(btn => btn.style.opacity = '1');
        showToast('PDF Generation Failed', 'error');
        console.error(err);
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    changeSection("1");
});