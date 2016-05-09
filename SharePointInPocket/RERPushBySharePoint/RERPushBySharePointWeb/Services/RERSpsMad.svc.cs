using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace RERPushBySharePointWeb.Services
{
    public class RERSpsMad : IRemoteEventService
    {
        /// <summary>
        /// Handles events that occur before an action occurs, such as when a user adds or deletes a list item.
        /// Run when Synchronous events will be triggered
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
        /// Run when Asynchronous events will be triggered
        /// </summary>
        /// <param name="properties">Holds information about the remote event.</param>
        public void ProcessOneWayEvent(SPRemoteEventProperties properties)
        {
            using (ClientContext clientContext = TokenHelper.CreateRemoteEventReceiverClientContext(properties))
            {
                if (clientContext != null)
                {
                    try
                    {
                        //http://sharepoint-community.net/profiles/blogs/working-with-remote-event-reciver-in-provider-hosted-app

                        List mochilaLib = clientContext.Web.Lists.GetByTitle("Mochila");
                        ListItem item = mochilaLib.GetItemById(properties.ItemEventProperties.ListItemId);
                        clientContext.Load(item);
                        clientContext.ExecuteQuery();
                        item["title"] += "RemoteER Push Works " + DateTime.Now.ToString();
                        //item["Status"] = "Activated" + item.Id;
                        item.Update();
                        //clientContext.Load(clientContext.Web);
                        clientContext.ExecuteQuery();

                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }

        }
    }
}
