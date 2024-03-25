type AttendanceResponse = {
    id: number | null,
    type: number,
    user: number,
    date: string
}


type HolidayResponse = {
    id: number | null,
    date: string,
    is_holiday: boolean

}
export const submitLeave = (
    csrfToken: string,
    sessionid: string,
    currentUser: number,
    req: { startDate: string, endDate: string, comment: string }
) => {
    const body = {
        user: currentUser,
        type: 2,
        start_date: req.startDate,
        end_date: req.endDate,
        comment: req.comment,
        timezone: "Europe/Helsinki"
    }
    return fetch("https://central.intelliarts.com/rest/leaves/", {
        headers: {
            "content-type": "application/json",
            "x-csrftoken": csrfToken,
            "x-requested-with": "XMLHttpRequest",
            "cookie": `csrftoken=${csrfToken}; sessionid=${sessionid}`,
        },
        body: JSON.stringify(body),
        method: "POST"
    }).then(res => res.json());
}

export const getHolidays = (csrfToken: string,
                            sessionid: string,
                            from: string,
                            to:string
): Promise<HolidayResponse[]> => {
    return fetch(`https://central.intelliarts.com/rest/holidays/?from=${from}&to=${to}&expand=true`, {
        headers: {
            "content-type": "application/json",
            "x-csrftoken": csrfToken,
            "x-requested-with": "XMLHttpRequest",
            "cookie": `csrftoken=${csrfToken}; sessionid=${sessionid}`,
        }
    }).then(res => res.json());
}

export const getAttendance = (csrfToken: string,
                              sessionid: string,
                              from: string,
                              to:string
): Promise<AttendanceResponse[]> => {
    return fetch(`https://central.intelliarts.com/rest/attendance/?from=${from}&to=${to}`, {
        headers: {
            "content-type": "application/json",
            "x-csrftoken": csrfToken,
            "x-requested-with": "XMLHttpRequest",
            "cookie": `csrftoken=${csrfToken}; sessionid=${sessionid}`,
        }
    }).then(res => res.json());
}