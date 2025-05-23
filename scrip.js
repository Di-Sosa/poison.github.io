// Initialize Mermaid
mermaid.initialize({ startOnLoad: true, theme: 'neutral', securityLevel: 'loose' }); // 'neutral' or 'forest' or 'dark'

document.addEventListener('DOMContentLoaded', function () {
    const accordionItems = document.querySelectorAll('.accordion-item');
    const expandAllButton = document.getElementById('expandAll');
    const collapseAllButton = document.getElementById('collapseAll');

    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Function to toggle a single accordion item
    function toggleAccordionItem(item, forceOpen = null) {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = header.querySelector('.accordion-icon');

        let isOpen = content.classList.contains('open');
        if (forceOpen !== null) {
            isOpen = !forceOpen; // If forceOpen is true, we want to open it, so isOpen should be false to trigger the 'open' logic
        }

        if (isOpen) {
            content.classList.remove('open');
            icon.classList.remove('rotate-180');
        } else {
            content.classList.add('open');
            icon.classList.add('rotate-180');
             // Re-render Mermaid diagrams if they are in the content,
             // only after the content is visible and sized.
            setTimeout(() => {
                const mermaidDiagrams = content.querySelectorAll('.mermaid');
                mermaidDiagrams.forEach((diagram) => {
                    const svgAlreadyExists = diagram.querySelector('svg');
                    if(!svgAlreadyExists) { // Render only if not already rendered
                        const id = `mermaid-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                        diagram.setAttribute('id', id);
                        mermaid.render(id, diagram.textContent.trim(), (svgCode) => {
                           diagram.innerHTML = svgCode;
                        }, diagram);
                    } else if (diagram.offsetHeight > 0) { // If already rendered, ensure it's sized correctly
                        diagram.innerHTML = diagram.innerHTML; // Force re-flow
                    }
                });
            }, 50); // A small delay to ensure DOM is updated
        }
    }

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            toggleAccordionItem(item);
        });
    });

    // Expand all
    expandAllButton.addEventListener('click', () => {
        accordionItems.forEach(item => {
            toggleAccordionItem(item, true); // forceOpen = true
        });
    });

    // Collapse all
    collapseAllButton.addEventListener('click', () => {
        accordionItems.forEach(item => {
            toggleAccordionItem(item, false); // forceOpen = false
        });
    });

    // Optional: Open the first accordion item by default
    if (accordionItems.length > 0) {
         // toggleAccordionItem(accordionItems[0], true); // Uncomment to open first item
    }
});