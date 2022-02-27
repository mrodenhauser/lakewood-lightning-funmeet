const db = require('../lib/databaseOperations');
const maps = require('../objectMappings');

function structureHeatSheet(heatSheetRecordsFlat) {

    const structuredHeatSheet = heatSheetRecordsFlat.reduce((prev, curr) => {
        const meet_found = prev.find(x => x.MeetId === curr.MeetId);
        if (!meet_found) {
            prev.push(maps.MeetWithEventsMapping(curr));
        } else {
            const event_found = meet_found.Events.find(x => x.EventId === curr.EventId);
            if (!event_found) {
                meet_found.Events.push(maps.EventWithHeatsMapping(curr));
            } else {
                let heat_found = event_found.Heats.find(x => x.HeatId === curr.HeatId);
                if (!heat_found) {
                    event_found.Heats.push(maps.getHeatWithTeamsOrIndividualsMapping(curr));
                } else {
                    if (curr.IsTeamEvent) {
                        let team_found = heat_found.Teams.find(x => x.TeamId === curr.TeamId);
                        if (!team_found) {
                            heat_found.Teams.push(maps.TeamWithMembersMapping(curr));
                        } else {
                            let individual_found = team_found.Members.find(x => x.IndividualId === curr.IndividualId);
                            if (!individual_found) {
                                team_found.Members.push(maps.IndividualMapping(curr));
                            } else {
                                console.warn("A heat sheet row with a duplicate Member/Individual on the " +
                                    "same team was ignored: " + JSON.stringify(curr));
                            }
                        }
                    } else { //Individual Event
                        let individual_found = heat_found.Individuals.find(x => x.IndividualId === curr.IndividualId);
                        if (!individual_found) {
                            heat_found.Individuals.push(maps.IndividualMapping(curr));
                        } else {
                            console.warn("A heat sheet row with a duplicate Individual in the same" +
                                " heat was ignored: " + JSON.stringify(curr));
                        }
                    }
                }
            }
        }
        return prev;
    }, []);

    return structuredHeatSheet[0]; //there should only be one as this be used on results of get by meet id
}

exports.getHeatSheet = async function getHeatSheet(meetId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.getEntities(
             'fGetHeatSheet',
             parseInt(meetId)) //TODO: work on logic to filter by teamId OR individualId as well
                .then(data => {
                    let structuredData = structureHeatSheet(data);
                    successFunc(structuredData);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        }
        catch (error) {
            console.error("Error trying to built heat sheet" + error);
            rejectedFunc(error);
        }
    });
 };