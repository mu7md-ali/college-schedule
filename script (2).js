// كل البيانات - 16 سكشن مع الأوقات والمدد
const periodInfo = {
    "1-2": { time: "9:15-10:45", duration: "90 min" },
    "3-4": { time: "10:55-12:25", duration: "90 min" },
    "5-6": { time: "12:45-2:10", duration: "85 min" },
    "7-8": { time: "2:20-3:45", duration: "85 min" }
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
    },
    // Custom Section - Empty for user to edit
    "custom": {
        group: "Custom",
        data: {
            "Sunday": {},
            "Monday": {},
            "Tuesday": {},
            "Wednesday": {},
            "Thursday": {}
        }
    }
};


// Available subjects for custom section
const availableSubjects = [
    { code: "BA", name: "Business Administration 💼", type: "L" },
    { code: "DS", name: "Data Structure 🌳", type: "L" },
    { code: "SA", name: "System Analysis 📊", type: "L" },
    { code: "WP", name: "Web Programming 🌐", type: "L" },
    { code: "CN", name: "Computer Network 🔌", type: "L" },
    { code: "HR", name: "Human Rights ⚖️", type: "L" },
    { code: "DS_LAB", name: "Data Structure (Lab) 🌳", type: "S" },
    { code: "CN_LAB", name: "Computer Network (Lab) 🔌", type: "S" },
    { code: "SA_LAB", name: "System Analysis (Lab) 📊", type: "S" },
    { code: "WP_LAB", name: "Web Programming (Lab) 🌐", type: "S" }
];

// Available rooms
const availableRooms = [
    "مدرج 1 إعلام", "مدرج 5 إعلام", "مدرج 7 علوم حاسب",
    "Lab 101", "Lab 102", "Lab 103", "Lab 104", "Lab 105",
    "Lab 201 AI", "Lab 203", "Lab 218 AI", "Lab 219 AI", "Lab 222 AI",
    "Lab 002", "Lab 003", "Lab 004", "Lab 303"
];

// Available doctors/TAs
const availableDoctors = [
    "Dr. Sameh Mohamed", "Dr. Osama Shafik", "Dr. Mohamed Mostafa",
    "Dr. Hesham Abo el-fotoh", "Dr. Ahmed Noaman", "Dr. Magdy Elhenawy",
    "T.A Esraa Ezzat", "T.A Esraa Safwat", "T.A Karen", "T.A Asmaa Hassan",
    "T.A Rowyda", "T.A Nadeen", "T.A Yoser", "T.A Asmaa Ghoniem",
    "T.A Reham", "T.A Layla", "T.A Ethar", "T.A Howida", "T.A Rehab", "T.A Salma Ayman"
];
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
        
        periods.forEach((p, pIndex) => {
            // Add break column after period 3-4 (index 1)
            if (pIndex === 2) {
                row.innerHTML += `
                    <td>
                        <div class="break-cell">
                            <div class="break-line"></div>
                            <span class="break-icon">☕</span>
                            <span class="break-text">BREAK</span>
                            <div class="break-line"></div>
                        </div>
                    </td>
                `;
            }
            
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
                        <div class="free-card">FREE</div>
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
    const periods = ["1-2", "3-4", "5-6", "7-8"];
    
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
            
            // Show all periods (including free ones)
            periods.forEach(period => {
                const cell = sec.data[day] && sec.data[day][period] ? sec.data[day][period] : null;
                const info = periodInfo[period];
                
                if (cell) {
                    const isLab = cell.t === 'S';
                    
                    const miniCard = document.createElement('div');
                    miniCard.className = `mini-card ${isLab ? 'lab' : ''}`;
                    miniCard.onclick = () => showDetails(day, period, secNum);
                    
                    miniCard.innerHTML = `
                        <div class="mini-time">${period} | ${info.time} | ${info.duration}</div>
                        <div class="mini-subject">${cell.n}</div>
                        <div class="mini-doctor">${cell.d}</div>
                        <div class="mini-room">${cell.r.replace(/AI/g, '<span style="color:#22d3ee;text-shadow:0 0 10px #22d3ee">AI</span>')}</div>
                    `;
                    
                    td.appendChild(miniCard);
                } else {
                    // Show FREE slot
                    const freeDiv = document.createElement('div');
                    freeDiv.className = 'mini-free';
                    freeDiv.innerHTML = `${period} | ${info.time}<br>FREE`;
                    td.appendChild(freeDiv);
                }
            });
            
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

// Download Table as PDF - Works on all devices
function downloadTable() {
    const { jsPDF } = window.jspdf;
    const area = document.getElementById('captureArea');

    showToast('Generating PDF...', 'info');

    // Create a wrapper that expands to fit all content
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = '-99999px';
    wrapper.style.left = '-99999px';
    wrapper.style.width = 'max-content';
    wrapper.style.minWidth = '1400px';
    wrapper.style.backgroundColor = '#0a0a0a';
    wrapper.style.padding = '30px';
    wrapper.style.boxSizing = 'border-box';

    // Clone the content
    const clone = area.cloneNode(true);
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.padding = '0';

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Wait for fonts and styles to load
    setTimeout(() => {
        html2canvas(wrapper, { 
            backgroundColor: '#0a0a0a', 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            width: wrapper.scrollWidth,
            height: wrapper.scrollHeight
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            // Calculate PDF dimensions
            const imgWidth = 297; // A4 width in mm (landscape)
            const pageHeight = 210; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF('l', 'mm', 'a4');

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add more pages if needed
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`CS_Schedule_Section_${currentSection}.pdf`);

            document.body.removeChild(wrapper);
            showToast('PDF Downloaded Successfully!', 'success');
        }).catch(err => {
            document.body.removeChild(wrapper);
            showToast('PDF Generation Failed', 'error');
            console.error(err);
        });
    }, 500);
}

// Download Group PDF - Fixed
function downloadGroupPDF() {
    const { jsPDF } = window.jspdf;
    
    showToast('Generating PDF... This may take a moment', 'info');
    
    const element = document.getElementById('groupView');
    
    // Create clone for capture
    const clone = element.cloneNode(true);
    clone.style.position = 'fixed';
    clone.style.top = '-9999px';
    clone.style.left = '-9999px';
    clone.style.width = '1400px'; // Fixed width for consistency
    document.body.appendChild(clone);
    
    html2canvas(clone, {
        backgroundColor: '#0a0a0a',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        width: 1400,
        windowWidth: 1400
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        
        // A4 Landscape
        const pdf = new jsPDF('l', 'mm', 'a4');
        const pageWidth = 297;
        const pageHeight = 210;
        
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(`CS_Schedule_Group_${currentGroup}.pdf`);
        
        document.body.removeChild(clone);
        showToast('PDF Downloaded Successfully!', 'success');
    }).catch(err => {
        document.body.removeChild(clone);
        showToast('PDF Generation Failed', 'error');
        console.error(err);
    });
}

// Initial Render - Load Section 1 by default
document.addEventListener('DOMContentLoaded', () => {
    changeSection('1');
});

// Show Academic Calendar Modal
function showAcademicCalendar() {
    document.getElementById('calendarModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Show Section Layout Modal
function showSectionLayout() {
    document.getElementById('layoutModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}
