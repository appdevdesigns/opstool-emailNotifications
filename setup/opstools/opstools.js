/**
 * This file specifies any default Ops Portal Tool Definitions 
 * provided by this modlue.
 *  
 */
module.exports = [

    { 
        key:'email.notifications', 
        permissions:'email.notifications.view', 
        icon:'fa-envelope-o', 
        controller:'EmailNotifications',
        label:'Email Notifications',
        // context:'opsportal',
        isController:true, 
        options:{}, 
        version:'0' 
    }

];
