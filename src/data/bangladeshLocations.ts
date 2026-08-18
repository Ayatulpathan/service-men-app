import { BangladeshLocationNode } from '../types';

export const BANGLADESH_LOCATIONS: BangladeshLocationNode[] = [
  {
    division: 'Dhaka',
    divisionBn: 'ঢাকা',
    districts: [
      {
        name: 'Dhaka',
        nameBn: 'ঢাকা',
        thanas: [
          {
            name: 'Mirpur',
            nameBn: 'মিরপুর',
            areas: ['Mirpur-1', 'Mirpur-2', 'Mirpur-6', 'Mirpur-10', 'Mirpur-11', 'Mirpur-12', 'Mirpur-14', 'Pallabi', 'Kazipara', 'Shewrapara']
          },
          {
            name: 'Dhanmondi',
            nameBn: 'ধানমন্ডি',
            areas: ['Road 27', 'Road 32', 'Shankar', 'Jigatola', 'Satmasjid Road', 'Kalabagan', 'Panthapath']
          },
          {
            name: 'Gulshan',
            nameBn: 'গুলশান',
            areas: ['Gulshan-1', 'Gulshan-2', 'Niketan', 'Police Plaza Area', 'Pink City']
          },
          {
            name: 'Banani',
            nameBn: 'বনানী',
            areas: ['Banani DOHS', 'Block A-F', 'Kemal Ataturk Avenue', 'Chairman Bari']
          },
          {
            name: 'Uttara',
            nameBn: 'উত্তরা',
            areas: ['Sector 1-3', 'Sector 4-7', 'Sector 9-11', 'Sector 12-14', 'Abdullahpur', 'Uttara Model Town']
          },
          {
            name: 'Mohammadpur',
            nameBn: 'মোহাম্মদপুর',
            areas: ['Town Hall', 'Japan Garden City', 'Salimullah Road', 'Taj Mahal Road', 'Noorjahan Road', 'Adabor', 'Shekhertek']
          },
          {
            name: 'Badda',
            nameBn: 'বাড্ডা',
            areas: ['Middle Badda', 'North Badda', 'South Badda', 'Aftabnagar', 'Merul Badda']
          },
          {
            name: 'Motijheel',
            nameBn: 'মতিঝিল',
            areas: ['Dilkusha', 'Arambagh', 'Fakirapool', 'Gopibagh', 'Kamalapur']
          },
          {
            name: 'Old Dhaka',
            nameBn: 'পুরান ঢাকা',
            areas: ['Lalbagh', 'Sadarghat', 'Wari', 'Chawkbazar', 'Gandaria', 'Armanitola', 'Sutrapur']
          },
          {
            name: 'Bashundhara R/A',
            nameBn: 'বসুন্ধরা আবাসিক',
            areas: ['Block A-D', 'Block E-G', 'Block I-N', 'Evercare Hospital Area']
          }
        ]
      },
      {
        name: 'Gazipur',
        nameBn: 'গাজীপুর',
        thanas: [
          {
            name: 'Gazipur Sadar',
            nameBn: 'গাজীপুর সদর',
            areas: ['Chourasta', 'Joydebpur', 'Board Bazar', 'Tongi Bazar', 'Tongi Station Road', 'Konabari']
          }
        ]
      },
      {
        name: 'Narayanganj',
        nameBn: 'নারায়ণগঞ্জ',
        thanas: [
          {
            name: 'Narayanganj Sadar',
            nameBn: 'নারায়ণগঞ্জ সদর',
            areas: ['Chashara', 'Chittagong Road', 'Signboard', 'Fatullah', 'Siddhirganj']
          }
        ]
      }
    ]
  },
  {
    division: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    districts: [
      {
        name: 'Chattogram',
        nameBn: 'চট্টগ্রাম',
        thanas: [
          {
            name: 'Agrabad',
            nameBn: 'আগ্রাবাদ',
            areas: ['Commercial Area', 'Access Road', 'Chowmuhani', 'Badamtoli']
          },
          {
            name: 'Nasirabad',
            nameBn: 'নাসিরাবাদ',
            areas: ['GEC Circle', 'Khulshi', 'Zakir Hossain Road', 'Sanmar Ocean City Area']
          },
          {
            name: 'Panchlaish',
            nameBn: 'পাঁচলাইশ',
            areas: ['Prabartak Circle', 'Muradpur', 'Chawkbazar', 'Bahaddarhat']
          },
          {
            name: 'Halishahar',
            nameBn: 'হালিশহর',
            areas: ['Block A-L', 'Boropool', 'Noyabazar']
          }
        ]
      },
      {
        name: "Cox's Bazar",
        nameBn: "কক্সবাজার",
        thanas: [
          {
            name: "Cox's Bazar Sadar",
            nameBn: 'কক্সবাজার সদর',
            areas: ['Kolatoli Beach Area', 'Sugandha Point', 'Laboni Point', 'Tekpara']
          }
        ]
      }
    ]
  },
  {
    division: 'Sylhet',
    divisionBn: 'সিলেট',
    districts: [
      {
        name: 'Sylhet',
        nameBn: 'সিলেট',
        thanas: [
          {
            name: 'Sylhet Sadar',
            nameBn: 'সিলেট সদর',
            areas: ['Zindabazar', 'Amberkhana', 'Shibgonj', 'Uposhohor', 'Chouhatta', 'Subidbazar']
          }
        ]
      }
    ]
  },
  {
    division: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    districts: [
      {
        name: 'Rajshahi',
        nameBn: 'রাজশাহী',
        thanas: [
          {
            name: 'Boalia',
            nameBn: 'বোয়ালিয়া',
            areas: ['Saheb Bazar', 'Alokar Mor', 'Zero Point', 'Ranibazar', 'Kazihata']
          },
          {
            name: 'Motihar',
            nameBn: 'মতিহার',
            areas: ['RU Campus', 'Kajla', 'Talaimari', 'Binodpur']
          }
        ]
      }
    ]
  },
  {
    division: 'Khulna',
    divisionBn: 'খুলনা',
    districts: [
      {
        name: 'Khulna',
        nameBn: 'খুলনা',
        thanas: [
          {
            name: 'Khulna Sadar',
            nameBn: 'খুলনা সদর',
            areas: ['Dakbangla', 'Boyra', 'Sonadanga', 'Shibbari Mor', 'Gollamari', 'Khalishpur']
          }
        ]
      }
    ]
  },
  {
    division: 'Barishal',
    divisionBn: 'বরিশাল',
    districts: [
      {
        name: 'Barishal',
        nameBn: 'বরিশাল',
        thanas: [
          {
            name: 'Barishal Sadar',
            nameBn: 'বরিশাল সদর',
            areas: ['Sadarganj', 'Nathullabad', 'Rupatoli', 'Chawkbazar', 'Band Road']
          }
        ]
      }
    ]
  },
  {
    division: 'Rangpur',
    divisionBn: 'রংপুর',
    districts: [
      {
        name: 'Rangpur',
        nameBn: 'রংপুর',
        thanas: [
          {
            name: 'Rangpur Sadar',
            nameBn: 'রংপুর সদর',
            areas: ['Jahaj Company Mor', 'Dhap', 'Medical Mor', 'Modern Mor', 'Shapla Chottor']
          }
        ]
      }
    ]
  },
  {
    division: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    districts: [
      {
        name: 'Mymensingh',
        nameBn: 'ময়মনসিংহ',
        thanas: [
          {
            name: 'Mymensingh Sadar',
            nameBn: 'ময়মনসিংহ সদর',
            areas: ['Ganginar Par', 'Town Hall', 'Chorpara', 'Akua', 'Boundary Road']
          }
        ]
      }
    ]
  }
];
