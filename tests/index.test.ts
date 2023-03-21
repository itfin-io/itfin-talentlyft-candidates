import { expect, test, jest } from '@jest/globals';
import './mocks';
import { onIncomingEvent } from '../src';
import {app} from "./mocks";

test('onIncomingEvent', async () => {
  const data = {
    "Uid":"fa819e01-8afc-4f74-acef-daf891777caf",
    "Topic":"candidate.hired",
    "Created":"2023-03-13T22:29:40.3247045Z",
    "FirstSentAt":"2023-03-13T22:29:40.3247045Z",
    "DeliveryAttempts":1,
    "SubscriptionId":"d130c4b4-a438-43fa-8fa1-0c9149c22383",
    "Payload":[{
      "Type":"Candidate",
      "Data":{
        "Skills":[],
        "Tags":[],
        "PhoneNumbers":[{"Id":6635989,"Value":"380936572141","Type":"phone"}],
        "SocialNetworks":[{"Id":6635993,"Value":"https://app.talentlyft.com/eliftech/ats/job/88122/stage/224155/candidate/3306365/application/4351140","Type":"other"},{"Id":6635998,"Value":"https://t.me/esvit666","Type":"other"}],
        "PossibleDuplicates":false,
        "Id":3306365,
        "FirstName":"Віталій",
        "LastName":"Савчук",
        "Name":"Савчук Віталій",
        "Title":"Dev",
        "Avatar":null,
        "Company":null,
        "Created":"2023-03-13T22:12:33.623",
        "Location":{"Id":2493679,"Country":"Ukraine","CountryCode":"UA","Region":null,"DistrictId":null,"City":null,"ZipCode":null,"Address":"Ukraine","Latitude":48.379432678222656,"Longitude":31.16558074951172},
        "Applications":[
            {"Id":4351140,"CandidateId":3306365,"ProfileUrl":"https://app.talentlyft.com/eliftech/ats/job/88122/stage/224155/candidate/3306365/application/4351140","Created":"2023-03-13T22:12:33.623","Disqualified":false,"DisqualificationReason":null,"DisqualifiedAt":null,"Stage":{"Id":224155,"Name":"Hired","Type":"Hired","Position":7},"Job":{"Id":88122,"Title":"Test"},"ExternalId":null,"Source":{"SourceType":"CareersPage","SourceTypeName":null,"SourceBy":null,"SourceFrom":"app.talentlyft.com","SourceChanel":"CareersPage","SourceFormatted":"Via app.talentlyft.com"},"Evaluation":{"DefinitelyNo":0,"No":0,"Yes":0,"DefinitelyYes":0},"PreviousEvaluation":{"DefinitelyNo":0,"No":0,"Yes":0,"DefinitelyYes":0}}
        ],
        "Emails":[
            {"Id":6572018,"Value":"das@mr.com","Type":"email"}
        ],
        "Uid":"915ff5dc-a528-43fd-a99f-65dd2cc316e5",
        "SnoozedUntil":null,
        "Url":"https://app.talentlyft.com/eliftech/engage/3306365?activityId=18650078"
      }
    }]
  };

  app.getAppConfig.mockImplementationOnce(() => ({ emailDomain: 'test.com' }));
  await onIncomingEvent('-', data);
  
  expect(ITFinRequest.post).toHaveBeenCalledWith(
      "/api/v1/employees",
      {"CandidateUrl": "https://app.talentlyft.com/eliftech/engage/3306365?activityId=18650078", "Country": "Ukraine", "DateOfEmployment": "2023-03-20", "Email": "vitaliy-savchuk@test.com", "FirstName": "Віталій", "LastName": "Савчук", "LocationCountry": "Ukraine", "NativeName": "Савчук Віталій", "PersonalEmail": "das@mr.com", "Status": "Active"},
      { "signed": true }
  );
});
