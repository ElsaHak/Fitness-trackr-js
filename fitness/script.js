document.addEventListener('DOMContentLoaded', () => {
    const logActivitySection = document.getElementById('log-activity-section');
    const activityHistorySection = document.getElementById('activity-history-section');
    const goalSettingSection = document.getElementById('goal-setting-section');
    const progressVisualizationSection = document.getElementById('progress-visualization-section');
    const workoutRemindersSection = document.getElementById('workout-reminders-section');

    
    const saveActivities = (activities) => {
        localStorage.setItem('activities', JSON.stringify(activities));
    };

    
    const getActivities = () => {
        return JSON.parse(localStorage.getItem('activities')) || [];
    };

   
    const saveGoals = (goals) => {
        localStorage.setItem('fitnessGoals', JSON.stringify(goals));
    };

   
    const getGoals = () => {
        return JSON.parse(localStorage.getItem('fitnessGoals')) || [];
    };

  
    const renderActivityHistory = () => {
        const activities = getActivities();
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';

        activities.forEach((activity) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `
                <strong>${activity.type}</strong> - ${activity.duration} min, ${activity.distance || 0} km, ${activity.calories} kcal
                <br><small>${activity.date}</small>
            `;
            activityList.appendChild(li);
        });
    };

   
    const renderGoals = () => {
        const goals = getGoals();
        const goalList = document.getElementById('goal-list');
        goalList.innerHTML = '';

        goals.forEach((goal, index) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `
                ${goal.type}: ${goal.amount} ${goal.unit}
                <button class="btn btn-danger btn-sm float-right" onclick="deleteGoal(${index})">Delete</button>
            `;
            goalList.appendChild(li);
        });
    };

    
    window.deleteGoal = (index) => {
        const goals = getGoals();
        goals.splice(index, 1);
        saveGoals(goals);
        renderGoals();
    };

    const renderProgressChart = () => {
        const activities = getActivities();
        const goals = getGoals();

        if (activities.length === 0 || goals.length === 0) {
            return;
        }

        const goal = goals[0]; 
        const goalAmount = goal.amount;
        const goalType = goal.type.toLowerCase();

        let total = 0;
        activities.forEach((activity) => {
            if (goalType === 'distance (km)' && activity.distance) {
                total += activity.distance;
            } else if (goalType === 'calories burned' && activity.calories) {
                total += activity.calories;
            } else if (goalType === 'duration (minutes)' && activity.duration) {
                total += activity.duration;
            }
        });

        const progressPercentage = (total / goalAmount) * 100;

        const ctx = document.getElementById('progress-chart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Progress', 'Remaining'],
                datasets: [{
                    data: [total, goalAmount - total],
                    backgroundColor: ['#4caf50', '#f44336'],
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: `Progress towards ${goalType} goal`,
                },
            },
        });
    };

   
    document.getElementById('log-activity-link').addEventListener('click', () => {
        logActivitySection.style.display = 'block';
        activityHistorySection.style.display = 'none';
        goalSettingSection.style.display = 'none';
        progressVisualizationSection.style.display = 'none';
        workoutRemindersSection.style.display = 'none';
    });

    document.getElementById('activity-history-link').addEventListener('click', () => {
        logActivitySection.style.display = 'none';
        activityHistorySection.style.display = 'block';
        goalSettingSection.style.display = 'none';
        progressVisualizationSection.style.display = 'none';
        workoutRemindersSection.style.display = 'none';
        renderActivityHistory();
    });

    document.getElementById('goal-setting-link').addEventListener('click', () => {
        logActivitySection.style.display = 'none';
        activityHistorySection.style.display = 'none';
        goalSettingSection.style.display = 'block';
        progressVisualizationSection.style.display = 'none';
        workoutRemindersSection.style.display = 'none';
        renderGoals();
    });

    document.getElementById('progress-visualization-link').addEventListener('click', () => {
        logActivitySection.style.display = 'none';
        activityHistorySection.style.display = 'none';
        goalSettingSection.style.display = 'none';
        progressVisualizationSection.style.display = 'block';
        workoutRemindersSection.style.display = 'none';
        renderProgressChart();
    });

    document.getElementById('workout-reminders-link').addEventListener('click', () => {
        logActivitySection.style.display = 'none';
        activityHistorySection.style.display = 'none';
        goalSettingSection.style.display = 'none';
        progressVisualizationSection.style.display = 'none';
        workoutRemindersSection.style.display = 'block';
    });

    
    document.getElementById('activity-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('activity-type').value;
        const duration = parseInt(document.getElementById('activity-duration').value);
        const distance = parseFloat(document.getElementById('activity-distance').value) || 0;
        const calories = parseInt(document.getElementById('activity-calories').value);

        const activities = getActivities();
        activities.push({
            type,
            duration,
            distance,
            calories,
            date: new Date().toLocaleString(),
        });

        saveActivities(activities);
        document.getElementById('activity-form').reset();
    });

    document.getElementById('goal-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const type = document.getElementById('goal-type').value;
        const amount = parseInt(document.getElementById('goal-amount').value);

        const goals = getGoals();
        goals.push({
            type,
            amount,
            unit: type === 'Distance (km)' ? 'km' : type === 'Calories Burned' ? 'kcal' : 'min',
        });

        saveGoals(goals);
        document.getElementById('goal-form').reset();
        renderGoals();
    });

    document.getElementById('reminder-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const time = parseInt(document.getElementById('reminder-time').value);

        const reminderMessage = document.getElementById('reminder-message');
        reminderMessage.innerHTML = `<div class="alert alert-success">Reminder set for ${time} minutes from now!</div>`;

        setTimeout(() => {
            alert('Time to workout!');
        }, time * 60000);
    });
});
