using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;
using Microsoft.Azure.NotificationHubs;

namespace RERSpsMadPushWeb.Services
{
    public class RemoteEventReceiver : IRemoteEventService
    {
        /// <summary>
        /// Handles events that occur before an action occurs, such as when a user adds or deletes a list item.
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        /// <returns>Holds information returned from the remote event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();

            using (ClientContext clientContext = TokenHelper.CreateRemoteEventReceiverClientContext(properties))
            {
                if (clientContext != null)
                {
                    clientContext.Load(clientContext.Web);
                    clientContext.ExecuteQuery();
                }
            }

            return result;
        }

        /// <summary>
        /// Handles events that occur after an action occurs, such as after a user adds an item to a list or deletes an item from a list.
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            using (ClientContext clientContext = TokenHelper.CreateRemoteEventReceiverClientContext(properties))
            {
                if (clientContext != null)
                {
                    clientContext.Load(clientContext.Web);
                    clientContext.ExecuteQuery();
                }
                NotificationHubClient hub = NotificationHubClient
               .CreateClientFromConnectionString("Endpoint=sb://sharepointmochilerohub-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=EkF8tKYhR2ntclKk4lbf+g97MZb2YCKgjY1dH66+zmo=", "sharepointmochilerohub");

                // Define a WNS payload
                var windowsToastPayload = @"<toast><visual><binding template=""ToastText01""><text id=""1"">"
                                        //+ item.Text + @"</text></binding></visual></toast>";
                                        + "You are the best" + @"</text></binding></visual></toast>";
                //var androidNotificationPayload = "{ \"data\" : {\"message\":\"" + item.Text + "\"}}";
                var androidNotificationPayload = "{ \"data\" : {\"message\":\"" + "kk test" + "\"}}";

                // Send the push notification.
                var resultWin = hub.SendWindowsNativeNotificationAsync(windowsToastPayload).Result;
                var resultAndroid = hub.SendGcmNativeNotificationAsync(androidNotificationPayload).Result;

            }
        }
    }
}
