/**
 * Advanced Anti-AdBlock Prevention Script
 * This script attempts to circumvent ad blockers by using various techniques
 */
(function() {
    // Store original ad-related functions that might be blocked
    const originals = {
        addEventListener: EventTarget.prototype.addEventListener,
        createElement: document.createElement,
        getElementById: document.getElementById,
        querySelector: document.querySelector
    };

    // Configuration
    const config = {
        adServerDomains: ['ads.example.com', 'ad.doubleclick.net', 'googleads.g.doubleclick.net'],
        adClassNames: ['ad', 'ads', 'adsbox', 'adsbygoogle', 'ad-unit'],
        adKeywords: ['sponsor', 'advertisement', 'banner', 'promo']
    };

    // Random string generator to create unique names
    function randomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        return Array(length).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    // Obfuscate class names to avoid detection
    function obfuscateAdClassNames() {
        const newClassMap = {};
        
        config.adClassNames.forEach(className => {
            const newName = 'content_' + randomString();
            newClassMap[className] = newName;
        });
        
        return newClassMap;
    }

    // Create a proxy for XMLHttpRequest to prevent blocking of ad-related requests
    function protectXmlHttpRequest() {
        const originalOpen = XMLHttpRequest.prototype.open;
        
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            // Check if URL contains any ad-related domains
            const isAdRequest = config.adServerDomains.some(domain => url.includes(domain));
            
            if (isAdRequest) {
                // Modify the URL to avoid detection (using a proxy or modifying the URL)
                const modifiedUrl = '/proxy?' + btoa(url);
                return originalOpen.call(this, method, modifiedUrl, async, user, password);
            }
            
            return originalOpen.call(this, method, url, async, user, password);
        };
    }

    // Prevent ad-related elements from being blocked
    function protectAdElements() {
        const classNameMap = obfuscateAdClassNames();
        
        // Override createElement to modify ad-related elements
        document.createElement = function(tagName) {
            const element = originals.createElement.call(document, tagName);
            
            // Add a mutation observer to protect against class-based blocking
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') {
                        const currentClasses = element.className.split(' ');
                        
                        currentClasses.forEach(cls => {
                            if (config.adClassNames.includes(cls)) {
                                // Replace blocked class with obfuscated version
                                element.classList.remove(cls);
                                element.classList.add(classNameMap[cls]);
                            }
                        });
                    }
                    
                    if (mutation.attributeName === 'style') {
                        // Check if element is being hidden
                        if (element.style.display === 'none' || element.style.visibility === 'hidden') {
                            element.style.display = 'block';
                            element.style.visibility = 'visible';
                        }
                    }
                });
            });
            
            observer.observe(element, { attributes: true });
            return element;
        };
    }

    // Monitor for ad blocker activity
    function monitorForBlockers() {
        // Create a test ad element
        const testAd = originals.createElement.call(document, 'div');
        testAd.className = 'adsbox ad-element';
        testAd.innerHTML = '&nbsp;';
        testAd.style.position = 'absolute';
        testAd.style.left = '-999px';
        document.body.appendChild(testAd);
        
        // Periodically check if the ad is being blocked
        setInterval(() => {
            if (testAd.offsetHeight === 0 || 
                testAd.clientHeight === 0 || 
                window.getComputedStyle(testAd).display === 'none' || 
                window.getComputedStyle(testAd).visibility === 'hidden') {
                
                // Ad blocker detected - take countermeasures
                deployCountermeasures();
            }
        }, 1000);
    }

    // Deploy countermeasures when ad blocker is detected
    function deployCountermeasures() {
        // Restore blocked ad elements
        document.querySelectorAll('[class*="ad"],[class*="ads"],[id*="ad"],[id*="ads"]').forEach(element => {
            element.style.display = 'block';
            element.style.visibility = 'visible';
        });
        
        // Add decoy ads that aren't actually ads
        for (let i = 0; i < 3; i++) {
            const decoy = originals.createElement.call(document, 'div');
            decoy.id = 'content_' + randomString();
            decoy.className = 'content_' + randomString();
            decoy.style.position = 'absolute';
            decoy.style.left = '-9999px';
            document.body.appendChild(decoy);
        }
        
        // Block access to content if ad blocker persists
        if (!window.adBlockNotified) {
            showAdBlockMessage();
            window.adBlockNotified = true;
        }
    }

    // Display message and block content
    function showAdBlockMessage() {
        // Create overlay
        const overlay = originals.createElement.call(document, 'div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        overlay.style.zIndex = '2147483647'; // Maximum z-index
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        
        // Create message container
        const messageBox = originals.createElement.call(document, 'div');
        messageBox.style.backgroundColor = '#fff';
        messageBox.style.borderRadius = '5px';
        messageBox.style.padding = '30px';
        messageBox.style.maxWidth = '600px';
        messageBox.style.textAlign = 'center';
        
        // Add content
        messageBox.innerHTML = `
            <h2 style="color: #e74c3c; margin-top: 0; font-size: 24px;">Ad Blocker Detected</h2>
            <p style="font-size: 16px; line-height: 1.6;">Our website relies on advertising revenue to provide free content. Please disable your ad blocker to continue.</p>
            <p style="font-size: 16px; line-height: 1.6;">After disabling your ad blocker, please refresh the page.</p>
            <button id="adblock-refresh" style="background-color: #3498db; color: #fff; border: none; padding: 12px 24px; border-radius: 4px; cursor: pointer; margin-top: 20px; font-size: 16px;">Refresh Page</button>
        `;
        
        overlay.appendChild(messageBox);
        document.body.appendChild(overlay);
        
        // Add event listener to refresh button
        document.getElementById('adblock-refresh').addEventListener('click', function() {
            location.reload();
        });
        
        // Hide all content behind the overlay
        Array.from(document.body.children).forEach(child => {
            if (child !== overlay) {
                child.style.display = 'none';
            }
        });
    }

    // Initialize on page load
    function initialize() {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(() => {
                protectXmlHttpRequest();
                protectAdElements();
                if (document.body) {
                    monitorForBlockers();
                } else {
                    document.addEventListener('DOMContentLoaded', monitorForBlockers);
                }
            }, 10);
        } else {
            document.addEventListener('DOMContentLoaded', initialize);
        }
    }

    // Start the protection
    initialize();
})();
