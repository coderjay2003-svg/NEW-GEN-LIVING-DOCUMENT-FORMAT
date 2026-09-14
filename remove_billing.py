import re
import os

target_files = ['index.html', 'pricing.html', 'features.html', 'format.html', 'docs.html', 'changelog.html', 'creator.html', 'viewer.html', 'live-studio.html', 'studio.html']

for file in target_files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Nav button
    content = re.sub(r'<button\s+class="nav-action-btn\s+pro-btn"\s+onclick="showBillingModal\(\)"[^>]*>[\s\S]*?</button>', '', content)
    
    # 2. Status bar button
    content = re.sub(r'<button\s+onclick="showBillingModal\(\)"\s+class="status-pro-btn">[\s\S]*?</button>', '', content)

    # 3. Buy Studio Pro button in pricing section
    content = re.sub(r'<button\s+onclick="showBillingModal\(\)"\s+class="btn-plan\s+btn-plan-primary">[\s\S]*?</button>', r'<a href="/pricing#downloads" class="btn-plan btn-plan-primary">Download LDOC Studio Pro</a>', content)

    # Auth profile section buttons
    content = re.sub(r'<button\s+class="profile-action-btn"\s+onclick="showBillingModal\(\);closeAuthModal\(\)">\s*<i class="fas fa-credit-card"></i> Manage Billing\s*</button>', '', content)
    content = re.sub(r'<button\s+class="upgrade-plan-btn"\s+onclick="showBillingModal\(\)">\s*Upgrade Plan\s*</button>', '', content)

    # 4. Remove billing-modal
    # Since regex for HTML is hard, let's find `<div id="billing-modal"` and balance tags
    start = content.find('<div id="billing-modal"')
    while start != -1:
        # find matching closing div
        div_count = 1
        i = start + 23
        while div_count > 0 and i < len(content):
            if content[i:i+4] == '<div':
                div_count += 1
                i += 4
            elif content[i:i+6] == '</div>':
                div_count -= 1
                i += 6
            else:
                i += 1
        content = content[:start] + content[i:]
        start = content.find('<div id="billing-modal"')

    # 5. Remove JavaScript functions
    funcs_to_remove = ['function showBillingModal()', 'function closeBillingModal()', 'function initiateStripeCheckout()', 'function initiateLemonCheckout()', 'function executeInstantFastCheckout(', 'function triggerConfettiBurst()', 'async function activateLicenseKeyFromModal(']
    
    for func in funcs_to_remove:
        start = content.find(func)
        while start != -1:
            # find matching closing brace
            brace_count = 0
            i = start
            found_open = False
            while i < len(content):
                if content[i] == '{':
                    brace_count += 1
                    found_open = True
                elif content[i] == '}':
                    brace_count -= 1
                i += 1
                if found_open and brace_count == 0:
                    break
            # check for LemonSqueezy.Setup init if it's there
            content = content[:start] + content[i:]
            start = content.find(func)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
