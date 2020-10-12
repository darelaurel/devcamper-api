const mongoose=require('mongoose')

const BootcampSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true, 'Veuillez ajouter un nom'],
        unique:true,
        trim:true,
        maxlength:[50,"Ce nom est trop long"]
    },
    
    slug:String,
    
    description:{
        type:String,
        required:[true, 'Veuillez ajouter une description'],
        maxlength:[500,"Cette description est trop longue"]
    },
    
    website:{
     type:String,
     match:
     [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
        'Veuillez entrer votre site web'
     ]   
    },
    
    phone:{
        type:String,
        match:[/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 
        'Le numero de telephone doit être compris entre 8 et 9 chiffres'
        ],
        maxlength:[20, ]
    },
    
    email:{
        type:String,
        match:[/^([a-z0-9._-]+)@([a-z0-9]+).([a-z]{2,6}$)/, 'Le mail ne correspond pas ']
    },
    
    address:{
        type:String,
        required:[true, 'Veuillez ajouter une adresse'],
    },
    
    location: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: false
        },
        coordinates: {
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
          min:[1, 'Le plus petit taux'],
          max:[10, 'Le plus grand taux']
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