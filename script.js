document.addEventListener('DOMContentLoaded', () => {
    const weekSelect = document.getElementById('week-select');
    const resultsContainer = document.getElementById('results-container');
    
    // DOM elements for the description
    const mainTitle = document.getElementById('main-title');
    const descriptionTitle = document.getElementById('description-title');
    const descriptionOverview = document.getElementById('description-overview');
    const descriptionPrerequisites = document.getElementById('description-prerequisites');
    const descriptionStages = document.getElementById('description-stages');

    const totalWeeks = 10; // Assume up to 10 weeks

    // Populate week selector
    for (let i = 1; i <= totalWeeks; i++) {
        const option = document.createElement('option');
        option.value = `week_${i}`;
        option.textContent = `Week ${i}`;
        weekSelect.appendChild(option);
    }

    // Function to update the project description
    const updateDescription = (week) => {
        fetch('test_descriptions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('test_descriptions.json not found.');
                }
                return response.json();
            })
            .then(descriptions => {
                const desc = descriptions[week];
                if (desc) {
                    mainTitle.textContent = desc.title;
                    descriptionTitle.textContent = 'Project Overview';
                    descriptionOverview.innerHTML = desc.overview;

                    descriptionPrerequisites.innerHTML = '';
                    if (desc.prerequisites && desc.prerequisites.length > 0) {
                        document.querySelector('#project-description h3:nth-of-type(1)').style.display = 'block';
                        desc.prerequisites.forEach(item => {
                            const li = document.createElement('li');
                            li.innerHTML = item;
                            descriptionPrerequisites.appendChild(li);
                        });
                    } else {
                         document.querySelector('#project-description h3:nth-of-type(1)').style.display = 'none';
                    }


                    descriptionStages.innerHTML = '';
                    if (desc.stages && desc.stages.length > 0) {
                        document.querySelector('#project-description h3:nth-of-type(2)').style.display = 'block';
                        desc.stages.forEach(item => {
                            const li = document.createElement('li');
                            li.innerHTML = item;
                            descriptionStages.appendChild(li);
                        });
                    } else {
                        document.querySelector('#project-description h3:nth-of-type(2)').style.display = 'none';
                    }

                } else {
                    mainTitle.textContent = 'Test Results';
                    descriptionTitle.textContent = 'No Description Available';
                    descriptionOverview.innerHTML = 'Project description has not been added for this week yet.';
                    descriptionPrerequisites.innerHTML = '';
                    descriptionStages.innerHTML = '';
                    document.querySelector('#project-description h3:nth-of-type(1)').style.display = 'none';
                    document.querySelector('#project-description h3:nth-of-type(2)').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching descriptions:', error);
                mainTitle.textContent = 'Test Results';
                descriptionTitle.textContent = 'Error';
                descriptionOverview.innerHTML = 'Could not load project descriptions. Make sure test_descriptions.json exists.';
                descriptionPrerequisites.innerHTML = '';
                descriptionStages.innerHTML = '';
            });
    };

    // Function to load and display results
    const loadResults = (week) => {
        const filePath = `test_results/${week}/${week}_results.json`;
        resultsContainer.innerHTML = '<p>Loading results...</p>';

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Results file not found for this week.');
                }
                return response.json();
            })
            .then(data => {
                resultsContainer.innerHTML = ''; // Clear loading message
                if (!data || data.length === 0) {
                    resultsContainer.innerHTML = '<p>No test results found for this week.</p>';
                    return;
                }

                data.forEach(result => {
                    const card = document.createElement('div');
                    card.className = 'result-card';

                    let cardContent = `<h2>${result.name || 'N/A'}</h2>`;
                    cardContent += `<p><strong>Username:</strong> ${result.username}</p>`;

                    for (const [key, value] of Object.entries(result)) {
                        if (key !== 'name' && key !== 'username') {
                            const statusClass = value === 'Pass' ? 'status-pass' : 'status-fail';
                            const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                            cardContent += `<p>${formattedKey}: <span class="${statusClass}">${value}</span></p>`;
                        }
                    }

                    card.innerHTML = cardContent;
                    resultsContainer.appendChild(card);
                });
            })
            .catch(error => {
                console.error('Error fetching test results:', error);
                resultsContainer.innerHTML = `<p>${error.message}</p>`;
            });
    };

    // Event listener for week selection
    weekSelect.addEventListener('change', () => {
        const selectedWeek = weekSelect.value;
        updateDescription(selectedWeek);
        loadResults(selectedWeek);
    });

    // Initial load
    const initialWeek = weekSelect.value;
    updateDescription(initialWeek);
    loadResults(initialWeek);
});
