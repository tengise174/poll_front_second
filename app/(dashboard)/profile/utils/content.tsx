const profileContent = {
    PERSON: {
        title: "Хэрэглэгчийн мэдээлэл",
        description: "Та мэдээллүүдээ сольж болно",
        content: [
            {
                name: "firstname",
                label: "Овог",
                itemType: "name",
            },
            {
                name: "lastname",
                label: "Нэр",
                itemType: "name",
            },
            {
                name: "username",
                label: "Нэвтрэх нэр",
                itemType: "name",
            },
        ]
    },
    COMPANY: {
        title: "Хэрэглэгчийн мэдээлэл",
        description: "Та мэдээллүүдээ сольж болно",
        content: [
            {
                name: "companyname",
                label: "Нэр",
                itemType: "name",
            },
            {
                name: "username",
                label: "Нэвтрэх нэр",
                itemType: "name",
            },
        ]
    }
}

export default profileContent;