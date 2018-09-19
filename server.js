var eventType = event.request.payload.type;

function get_unity_ids(issue)
{

    var ids = [];

    if (issue.hasOwnProperty("recordings"))
    {
        issue.recordings.forEach(function(recording)
        {
            if (recording.hasOwnProperty("attributes"))
                if (recording.attributes.hasOwnProperty("UnityID"))
                    ids.push(recording.attributes.UnityID);

        });

    }

    return ids;

}

if (eventType.includes("issue."))
{
    var issue = event.request.payload.payload.issue;

    var unity_ids = get_unity_ids(issue);

    var insert = {"resource": [ { "key": issue.key, "unity_ids": unity_ids }]};
    result = platform.api.post('bugsee/_table/issue_to_unity_id', insert, null);
    event.response.content = result;

}
else if (eventType.includes("comment."))
{
    var insert = {"resource": [payload]};
    result = platform.api.post('bugsee/_table/comments', insert, null);
    event.response.status_code = 200;
    event.response.content = {"success": "true"};
}
else
{
    event.response.status_code = 400;
    event.response.content = {"error": "Event not supported."};
}
