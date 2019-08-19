export class NavigationModel
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'pages',
                'title'   : 'Pages',
                'type'    : 'group',
                'icon'    : 'pages',
                'children': [
                    /* {
                        'id'      : 'authentication',
                        'title'   : 'Authentication',
                        'type'    : 'collapse',
                        'icon'    : 'lock',
                        'children': [
                            {
                                'id'   : 'login',
                                'title': 'Login',
                                'type' : 'item',
                                'url'  : '/pages/auth/login'
                            },
                            {
                                'id'   : 'forgot-password',
                                'title': 'Forgot Password',
                                'type' : 'item',
                                'url'  : '/pages/auth/forgot-password'
                            },
                            {
                                'id'   : 'reset-password',
                                'title': 'Reset Password',
                                'type' : 'item',
                                'url'  : '/pages/auth/reset-password'
                            }
                        ]
                    }, */
                    {
                        'id'      : 'users_management',
                        'title'   : 'Users Managemet',
                        'type'    : 'item',
                        'icon'    : 'person',
                        'url'     : '/pages/users-management'
                    },
                    {
                        'id'      : 'business_management',
                        'title'   : 'Business Cat. Managemet',
                        'type'    : 'item',
                        'icon'    : 'business_center',
                        'url'     : '/pages/business-management'
                    },
                    {
                        'id'      : 'categories_management',
                        'title'   : 'Categories Managemet',
                        'type'    : 'item',
                        'icon'    : 'category',
                        'url'     : '/pages/categories-management'
                    },
                    {
                        'id'      : 'regions_management',
                        'title'   : 'Regions Managemet',
                        'type'    : 'item',
                        'icon'    : 'location_city',
                        'url'     : '/pages/regions-management'
                    },
                    {
                        'id'      : 'ads_management',
                        'title'   : 'Ads Managemet',
                        'type'    : 'item',
                        'icon'    : 'chrome_reader_mode',
                        'url'     : '/pages/ads-management'
                    },
                    {
                        'id'      : 'volumes_management',
                        'title'   : 'Volumes Managemet',
                        'type'    : 'item',
                        'icon'    : 'library_books',
                        'url'     : '/pages/volumes-management'
                    },
                    {
                        'id'      : 'global_business_management',
                        'title'   : 'Business Managemet',
                        'type'    : 'item',
                        'icon'    : 'business',
                        'url'     : '/pages/global-business-management'
                    },
                    {
                        'id'      : 'push-notification',
                        'title'   : 'Push Notifications',
                        'type'    : 'item',
                        'icon'    : 'notifications_active',
                        'url'     : '/pages/push-notification'
                    },
                    {
                        'id' : 'backup' , 
                        'title' : 'Backups Managment', 
                        'type' : 'item'  , 
                        'icon' : 'backup' , 
                        'url' : '/pages/backups-management'
                    }
                 
                ]}
         
     
        ];
    }
}

