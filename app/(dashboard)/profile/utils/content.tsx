const profileContent = {
    // Person profile 
    PERSON: {
        title: "Хэрэглэгчийн мэдээлэл",
        description: "Та мэдээллүүдээ сольж болно",
        content: [
            // firstname
            {
                name: "firstname",
                label: "Овог",
                itemType: "name",
            },
            // lastname
            {
                name: "lastname",
                label: "Нэр",
                itemType: "name",
            },
            // username
            {
                name: "username",
                label: "Нэвтрэх нэр",
                itemType: "name",
            },
        ]
    },
    // COMPANY profile
    COMPANY: {
        title: "Хэрэглэгчийн мэдээлэл",
        description: "Та мэдээллүүдээ сольж болно",
        content: [
            // COMPANY name
            {
                name: "companyname",
                label: "Нэр",
                itemType: "name",
            },
            // COMPANY username
            {
                name: "username",
                label: "Нэвтрэх нэр",
                itemType: "name",
            },
        ]
    }
}

export default profileContent;