//Fetch
async function fetchGitHubActivity(usr) {
    const response = await fetch(
        `https://api.github.com/users/${usr}/events`,
        {
            headers:{
                "User-Agent" : "node.js",
            },
        },
    );    

    if(!response.ok){
        if(response.status === 404){
            throw new Error("User not Found!");
        }
        else{
            throw new Error(`Error: ${response.status}`);
        }
    }
    
    return response.json();
}

//Display
function display(events){
    if(events.length === 0){
        console.log("No recent activity.")
        return;
    }

    events.forEach((event) => {
        let msg;

        switch(event.type){

            case "PushEvent":
                const commitCount = event.payload.commits ? event.payload.commits.length:0;
                msg = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
                break;
            case "IssuesEvent":
                msg = `${event.payload.action.charAt(0).toUpperCase() + event.payload.action.slice(1)} an issue in ${event.repo.name}`;
                break;
            case "WatchEvent":
                msg = `Starred ${event.repo.name}`;
                break;
            case "ForkEvent":
                msg = `Forked ${event.repo.name}`;
                break;
            case "CreateEvent":
                msg = `Created ${event.payload.ref_type} in ${event.repo.name}`;
                break;
            default:
                msg = `${event.type.replace("Event", "")} in ${event.repo.name}`;
                break;
        }
        console.log(`-${msg}`);
    });
}


//Pilot part

const usr = process.argv[2];
if(!usr){
    console.error("Please provide a Github username.")
    process.exit(1);
} 

async function pilot() {
    try {
        const events = await fetchGitHubActivity(usr);
        display(events);
    } catch (error) {
        console.error(error.message);
        //process.exit(1);
    }
}

pilot()
