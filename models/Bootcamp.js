const mongoose=require('mongoose')

const slugify=require('slugify');

const geocoder=require('./../utils/geocoder');

const BootcampSchema=new mongoose.Schema(
  {

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
     [/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
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
        match:[/^([a-z0-9._-]+)@([a-z0-9._-]+).([a-z]{2,6}$)/, 'The mail doesn\'t match ']
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
            'Business',
            "Data Science",
            "Artificial Intelligence"
        ]
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
    versionKey: false ,
    acceptGi: {
          type:Boolean,
          default:false
          },
    createAt:
    {
            type:Date,
            default:Date.now
    },
    user: 
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    /***
     * acccess datas transformed in api response
     */
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
  }
)

BootcampSchema.pre('save',function(next){
  this.slug=slugify(this.name,{lower:true});
  next();
})


/***
 * Geocode & creation of location field
 * Geocoding returns lat and long from normal adress
 * Reverse geocoding makes opposite
 */

BootcampSchema.pre('save', async function(next){
  const loc=await geocoder.geocode(this.address);
  this.location=
  {
    type:'Point',
    coordinates:[loc[0].longitude,loc[0].latitude],
    formattedAddress:loc[0].formattedAddress,
    street:loc[0].streetName,
    city:loc[0].city,
    state:loc[0].stateCode,
    zipcode:loc[0].zipcode,
    country:loc[0].countryCode
  }
  this.address=undefined;
  next();
})

/***
 *  Cascade delete courses when a bootcamp is deleted
 */ 
BootcampSchema.pre('remove', async function(next) {
  console.log(`Courses being removed from bootcamp ${this._id}`);
  await this.model('Course').deleteMany({ bootcamp: this._id });
  next();
});

/***
 * Get courses of a bootcamp based on Id
 * wrapped in courses
 */
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
});


module.exports=mongoose.model('Bootcamp', BootcampSchema)