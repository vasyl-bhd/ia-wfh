export async function getPageData() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true})

    const allCookies = await chrome.cookies.getAll({url: tab.url}) || []

    function getCurrentUser(val: string) {
        return window[val]
    }
    const res = await chrome.scripting.executeScript({
        target: {tabId: tab.id || 0},
        func: getCurrentUser,
        args: ["current_user"],
        world: "MAIN"
    })
    const userId: number = await res[0].result

    const cookieToValue = allCookies.reduce((acc, item) => {
        acc[item.name] = item.value

        return acc
    }, {} as Record<string, string>)

    return {
        userId,
        sessionid: cookieToValue['sessionid'],
        csrftoken: cookieToValue['csrftoken']
    }
}