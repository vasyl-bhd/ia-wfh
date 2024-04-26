chrome.runtime.onInstalled.addListener(async () => {
    const rules = [{
        id: 1,
        action: {
            type: 'modifyHeaders',
            requestHeaders: [{
                header: 'Referer',
                operation: 'set',
                value: 'https://central.intelliarts.com/attendance/user/',
            }],
        },
        condition: {
            domains: [chrome.runtime.id],
            urlFilter: '|https://central.intelliarts.com',
            resourceTypes: ['xmlhttprequest'],
        },
    }];
    await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(r => r.id),
        addRules: rules,
    });
});