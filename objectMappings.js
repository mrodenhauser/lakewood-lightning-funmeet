exports.IndividualMapping = obj => ({
    IndividualId: obj.IndividualId,
    FirstName: obj.FirstName,
    NickName: obj.NickName,
    LastName: obj.LastName,
    Age: obj.Age,
    IsTeamCaptain: obj.IsTeamCaptain
});

exports.IndividualWithEventsMapping = obj => ({
    IndividualId: obj.IndividualId,
    FirstName: obj.FirstName,
    NickName: obj.NickName,
    LastName: obj.LastName,
    Age: obj.Age,
    IsTeamCaptain: obj.IsTeamCaptain,
    Events: [this.EventMapping(obj)]
});

exports.TeamWithMembersMapping = obj => ({
    TeamId: obj.TeamId,
    TeamName: obj.TeamName,
    Members : [this.IndividualMapping(obj)]
});

exports.TeamMapping = obj => ({
    TeamId: obj.TeamId,
    TeamName: obj.TeamName
});

exports.getHeatWithTeamsOrIndividualsMapping = (obj) => {
    if (obj.IsTeamEvent && obj.IsTeamEvent === true) {
        return {
            HeatId: obj.HeatId,
            HeatNumber: obj.Heat_Number,
            Teams: [this.TeamWithMembersMapping(obj)]
        }
    } else {
        return {
            HeatId: obj.HeatId,
            HeatNumber: obj.Heat_Number,
            Individuals: [this.IndividualMapping(obj)]
        };
    }
};

exports.HeatMapping = obj => ({
    HeatId: obj.HeatId,
    HeatNumber: obj.Heat_Number
});

exports.EventWithHeatsMapping= obj => ({
    EventId: obj.EventId,
    EventDefinitionId: obj.EventDefinitionId,
    EventDescription: obj.EventDescription,
    EventNumber: obj.EventNumber,
    DisplayRules: obj.DisplayRules,
    TeamSizeMin: obj.TeamSizeMin,
    TeamSizeMax: obj.TeamSizeMax,
    DistanceNum: obj.DistanceNum,
    DistanceUnit: obj.DistanceUnit,
    MaxTeamsPerHeat: obj.MaxTeamsPerHeat,
    ScheduleDate: obj.ScheduleDate,
    ScheduleTime: obj.ScheduleTime,
    AgeMin: obj.AgeMin,
    AgeMax: obj.AgeMax,
    CreatedDtm: obj.CreatedDtm,
    IsTeamEvent: obj.IsTeamEvent,
    HeatCount: obj.EventHeatCount,
    MeetId: obj.MeetId,
    Heats: [this.getHeatWithTeamsOrIndividualsMapping(obj)]
});

exports.EventWithoutHeatsMapping= obj => ({
    EventId: obj.EventId,
    EventDefinitionId: obj.EventDefinitionId,
    EventDescription: obj.EventDescription,
    EventNumber: obj.EventNumber,
    DisplayRules: obj.DisplayRules,
    TeamSizeMin: obj.TeamSizeMin,
    TeamSizeMax: obj.TeamSizeMax,
    DistanceNum: obj.DistanceNum,
    DistanceUnit: obj.DistanceUnit,
    MaxTeamsPerHeat: obj.MaxTeamsPerHeat,
    ScheduleDate: obj.ScheduleDate,
    ScheduleTime: obj.ScheduleTime,
    AgeMin: obj.AgeMin,
    AgeMax: obj.AgeMax,
    CreatedDtm: obj.CreatedDtm,
    IsTeamEvent: obj.IsTeamEvent,
    HeatCount: obj.EventHeatCount,
    MeetId: obj.MeetId,
    Heats: [this.getHeatWithTeamsOrIndividualsMapping(obj)]
});

exports.EventMapping= obj => ({
    EventId: obj.EventId,
    EventDefinitionId: obj.EventDefinitionId,
    EventDescription: obj.EventDescription,
    EventNumber: obj.EventNumber,
    DisplayRules: obj.DisplayRules,
    TeamSizeMin: obj.TeamSizeMin,
    TeamSizeMax: obj.TeamSizeMax,
    DistanceNum: obj.DistanceNum,
    DistanceUnit: obj.DistanceUnit,
    MaxTeamsPerHeat: obj.MaxTeamsPerHeat,
    ScheduleDate: obj.ScheduleDate,
    ScheduleTime: obj.ScheduleTime,
    AgeMin: obj.AgeMin,
    AgeMax: obj.AgeMax,
    CreatedDtm: obj.CreatedDtm,
    IsTeamEvent: obj.IsTeamEvent,
    HeatCount: obj.EventHeatCount,
    MeetId: obj.MeetId
});

exports.MeetWithEventsMapping= obj => ({
    MeetId: obj.MeetId,
    MeetName: obj.MeetName,
    MeetBannerDescription: obj.MeetBannerDescription,
    MeetDate: obj.MeetDate,
    EventCount: obj.eventcount,
    ScheduledEventCount: obj.ScheduledEventCount,
    TeamCount: obj.teamcount,
    IndividualCount: obj.individualcount,
    HeatCount: obj.heatcount,
    Events: [this.EventWithHeatsMapping(obj)]
});

exports.MeetMapping= obj => ({
    MeetId: obj.MeetId,
    MeetName: obj.MeetName,
    MeetBannerDescription: obj.MeetBannerDescription,
    MeetDate: obj.MeetDate,
    EventCount: obj.eventcount,
    ScheduledEventCount: obj.ScheduledEventCount,
    TeamCount: obj.teamcount,
    IndividualCount: obj.individualcount,
    HeatCount: obj.heatcount
});