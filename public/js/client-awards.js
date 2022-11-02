function LoadHabitsWithAwardsModule() {
    const loadHabitsWithAwardsModule = {};
    const habitsSection = document.querySelector("div#habitsWithAwards");

    // get image and habit status
    async function getHabitsWithAwards() {
        const res = await fetch(
            "/api/myhabits/myHabitsWithAwards"
        );
        if (!(res.ok && res.status === 200)) {
            return console.log("Error downloading the habits with awards", res);
        }

        const habitsWithAwards = await res.json();
        console.log("in LoadHabitsWithAwards habits", habitsWithAwards);
        renderHabitsWithAwards(habitsWithAwards);
    }

    function renderHabitsWithAwards(habitsWithAwards) {
        //clear it out first
        habitsSection.innerHTML = "";
        console.log(habitsWithAwards);
        if (habitsWithAwards.length != 0) {
            for (let h of habitsWithAwards) {
                renderHabitWithAward(h);
            }
        }
    }

    function renderHabitWithAward(h) {
        console.log("render habit with award", h);

        const habitWithAwardDiv = document.createElement("div");
        habitWithAwardDiv.className = "my-2";
        console.log(h.picture);
        habitWithAwardDiv.innerHTML = `
            <div class="py-2"><h4>Completed ${h.habit}  habit</h4> </div>
            <img
                class="w-50 rounded"
                src="${h.picture}"
            />`;
        habitsSection.appendChild(habitWithAwardDiv);
        // TODO: extend this object
    }
    loadHabitsWithAwardsModule.getHabitsWithAwards = getHabitsWithAwards;
    return loadHabitsWithAwardsModule;
}
