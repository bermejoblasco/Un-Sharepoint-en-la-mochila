using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;
using System.Reflection;

namespace RERSpsMadPushWeb.Services
{
    public class AppEventReceiver : IRemoteEventService
    {
        /// <summary>
        /// Handles app events that occur after the app is installed or upgraded, or when app is being uninstalled.
        /// </summary>
        /// <param name="properties">Holds information about the app event.</param>
        /// <returns>Holds information returned from the app event.</returns>
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            SPRemoteEventResult result = new SPRemoteEventResult();
            try
            {
                switch (properties.EventType)
                {
                    case SPRemoteEventType.AppInstalled:
                        HandleAppInstalled(properties);
                        break;

                    case SPRemoteEventType.AppUninstalling:
                        HandleAppUnistalled(properties);
                        break;
                }

            }
            catch (Exception ex)
            {

            }

            using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, useAppWeb: false))
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
        /// This method is a required placeholder, but is not used by app events.
        /// </summary>
        /// <param name="properties">Unused.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            throw new NotImplementedException();
        }

        #region PrivateMethod

        private void HandleAppInstalled(SPRemoteEventProperties properties)
        {
            try
            {
                using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, false))
                {
                    if (clientContext != null)
                    {
                        List olist = clientContext.Web.Lists.GetByTitle("Mochila");
                        clientContext.Load(olist, o => o.EventReceivers);
                        clientContext.ExecuteQuery();
                        bool isReRExsist = false;
                        foreach (var receiver in olist.EventReceivers)
                        {
                            if (receiver.ReceiverName == "RERSpsMadPushNotification")
                            {
                                isReRExsist = true;
                                break;
                            }
                        }
                        if (!isReRExsist)
                        {

                            //string remoteUrl = "https://xyz.azurewebsites.net/Services/RemoteEventReceiver1.svc";
                            string remoteUrl = "https://localhost:44304/Services/AppEventReceiver.svc";

                            EventReceiverDefinitionCreationInformation eventReDefCreation = new EventReceiverDefinitionCreationInformation()
                            {

                                EventType = EventReceiverType.ItemAdded,
                                ReceiverAssembly = Assembly.GetExecutingAssembly().FullName,
                                ReceiverName = "RERSpsMadPushNotification",
                                ReceiverClass = "RERSpsMadPushNotification",
                                ReceiverUrl = remoteUrl,
                                SequenceNumber = 15000
                            };
                            olist.EventReceivers.Add(eventReDefCreation);
                            clientContext.ExecuteQuery();

                        }
                    }
                }
            }
            catch (Exception ex)
            {
            }
        }

        private void HandleAppUnistalled(SPRemoteEventProperties properties)
        {
            using (ClientContext clientContext = TokenHelper.CreateAppEventClientContext(properties, false))
            {
                var list = clientContext.Web.Lists.GetByTitle("Mochila");
                clientContext.Load(list);
                clientContext.ExecuteQuery();
                EventReceiverDefinitionCollection eventRColl = list.EventReceivers;
                clientContext.Load(eventRColl);
                clientContext.ExecuteQuery();
                List<EventReceiverDefinition> toDelete = new List<EventReceiverDefinition>();
                foreach (EventReceiverDefinition erdef in eventRColl)
                {
                    if (erdef.ReceiverName == "RERSpsMadPushNotification")
                    {
                        toDelete.Add(erdef);
                    }
                }

                //Delete the remote event receiver from the list, when the app gets uninstalled
                foreach (EventReceiverDefinition item in toDelete)
                {
                    item.DeleteObject();
                    clientContext.ExecuteQuery();
                }
            }
        }

        #endregion PrivateMethod

    }
}
