/**
 * The folder sub-components contains sub component of all the pages,
 * so here you will find folder names which are listed in root pages.
 */



// sub components for /pages/profile
import AboutMe from 'sub-components/profile/AboutMe';
import ActivityFeed from 'sub-components/profile/ActivityFeed';
import MyTeam from 'sub-components/profile/QualificationsForOverview';
import ProfileHeader from 'sub-components/profile/ProfileHeader';
import ProjectsContributions from 'sub-components/profile/AddressForOverview';
import RecentFromBlog from 'sub-components/profile/BankDetailsForOverview';
import AddressPage from 'sub-components/profile/Address'
import QualificationPage from 'sub-components/profile/Qualification';
import BankDetailPage from 'sub-components/profile/BankDetail';
import DocumentPage from 'sub-components/profile/Document'

// sub components for /pages/billing
import CurrentPlan from 'sub-components/billing/CurrentPlan';
import BillingAddress from 'sub-components/billing/BillingAddress';

// sub components for /pages/settings
import DeleteAccount from 'sub-components/settings/DeleteAccount';
import EmailSetting from 'sub-components/settings/EmailSetting';
import GeneralSetting from 'sub-components/settings/GeneralSetting';
import Notifications from 'sub-components/settings/Notifications';
import Preferences from 'sub-components/settings/Preferences';


export {
   
   
   AboutMe,
   BankDetailPage,
   AddressPage,
   ActivityFeed,
   QualificationPage,
   MyTeam,
   DocumentPage,
   ProfileHeader,
   ProjectsContributions,
   RecentFromBlog,

   CurrentPlan,
   BillingAddress,

   DeleteAccount, 
   EmailSetting,  
   GeneralSetting, 
   Notifications, 
   Preferences
};
