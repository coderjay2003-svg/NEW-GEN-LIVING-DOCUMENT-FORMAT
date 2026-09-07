import re
import os

target_files = ['index.html', 'pricing.html', 'features.html', 'format.html', 'docs.html', 'changelog.html', 'creator.html', 'viewer.html', 'live-studio.html', 'studio.html']

for file in target_files:
    if not os.path.exists(file): continue
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Generic replaces
    content = re.sub(r'onclick="showBillingModal\(\)[^"]*"', 'onclick=""', content)
    content = re.sub(r'onclick="initiateLemonCheckout[^"]*"', 'onclick=""', content)
    
    # Pricing button specifics
    content = re.sub(r'<button[^>]*>💎? Upgrade Plan</button>', '', content)
    content = re.sub(r'<button[^>]*>💎? Manage Billing</button>', '', content)
    content = re.sub(r'<button[^>]*>Upgrade to Pro Studio</button>', '<a href="/pricing#downloads" class="portal-btn primary-glow" style="width:100%;margin-top:auto;text-align:center;text-decoration:none;display:inline-block">Download Pro Studio</a>', content)
    
    # Modals
    # Regex to find div with id="billing-modal" and remove until its end.
    # A bit hard, let's use a simpler way
    
    lines = content.split('\n')
    new_lines = []
    skip = False
    skip_divs = 0
    in_script_func = False
    brace_count = 0
    
    for line in lines:
        if '<div id="billing-modal"' in line:
            skip = True
            skip_divs = line.count('<div') - line.count('</div>')
            continue
            
        if skip:
            skip_divs += line.count('<div') - line.count('</div>')
            if skip_divs <= 0:
                skip = False
            continue
            
        if any(f in line for f in ['function showBillingModal', 'function closeBillingModal', 'function initiateStripeCheckout', 'function initiateLemonCheckout', 'function executeInstantFastCheckout', 'function triggerConfettiBurst', 'async function activateLicenseKeyFromModal']):
            in_script_func = True
            brace_count = line.count('{') - line.count('}')
            continue
            
        if in_script_func:
            brace_count += line.count('{') - line.count('}')
            if brace_count <= 0:
                in_script_func = False
            continue
            
        new_lines.append(line)
        
    content = '\n'.join(new_lines)
    
    # Remove any stray empty onclicks
    content = content.replace('onclick=""', '')

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
