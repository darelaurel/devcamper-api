const mongoose=require('mongoose')

const BootcampSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Please fill a name'],
        unique:true,
        trim:true,
        maxlength:[50,"The name is too long"]
    },
    
    slug:String,
    
    description:{
        type:String,
        required:[true, 'Please add description'],
        maxlength:[500,"The description is too long"]
    },
    
    website:{
     type:String,
     match:
     [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please add your website'
     ]   
    },
    
    phone:{
        type:String,
        match:[/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 
        'The phone number is incorrect'
        ],
        maxlength:[20, "The phone number is too long"]
    },
    
    email:{
        type:String,
        match:[/^([a-z0-9._-]+)@([a-z0-9]+).([a-z]{2,6}$)/, 'The mail doesn\'t match ']
    },
    
    address:{
        type:String,
        required:[true,'Please add adress'],
    },
    
    location: 
    {
        type: 
        {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: false
        },
        coordinates: 
        {
          type: [Number],
          required: false,
          index:'2dsphere'
        },
    
        formattedAddress:String,
        street:String,
        city:String,
        state:String,
        zipcode:String,
        country:String
      },
    
      careers:{
          type:[String],
          required:true,
          enum:[
              'Web Development',
              'Mobile Development',
              'UI/UX',
              'Business'
          ]
      },
    
      averageRating:{
          type:Number,
          min:[1, 'The smallest rate'],
          max:[10, 'The biggest rate']
      },
    
      averageCost:Number,
    
      photo:{
        type:String,
        default:'avatar-png'
      },

      housing:{
          type:Boolean,
          default:false
      },
      
      jobAssistance:{
        type:Boolean,
        default:false
        },

      jobGuarantee:{
        type:Boolean,
        default:false
        },

	  acceptGi: {
        type:Boolean,
        default:false
        },
      createAt:{
          type:Date,
          default:Date.now
      }
})

module.exports=mongoose.model('Bootcamp', BootcampSchema)