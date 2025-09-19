const { Mongoose } = require("mongoose");
const Category = require("../models/Category");
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

exports.createCategory = async (req, res) => {
	try {
		const { name, description } = req.body;
		if (!name) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const CategorysDetails = await Category.create({
			name: name,
			description: description,
		});
		console.log(CategorysDetails);
		return res.status(200).json({
			success: true,
			message: "Categorys Created Successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: true,
			message: error.message,
		});
	}
};

exports.showAllCategories = async (req, res) => {
	try {
        console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategorys = await Category.find({});
		res.status(200).json({
			success: true,
			data: allCategorys,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
      const { categoryId } = req.body
      console.log("PRINTING CATEGORY ID:"+categoryId);
			
      // Get courses for the specified category
      const selectedCategory = await Category.findById(categoryId).populate({
          path: "courses",
          match: { status: "Published" },
          populate: "ratingAndReviews",
        }).exec()
				console.log("Selected Category:" ,selectedCategory );
				console.log("Selected Category Negation:",!selectedCategory);
				
      // Handle the case when the category is not found
      if (!selectedCategory) {
        console.log("Category not found.")
        return res
          .status(404)
          .json({ success: false, message: "Category not found" })
      }
      // Handle the case when there are no courses
      if (selectedCategory.courses.length === 0) {
        console.log("No courses found for the selected category.")
        return res.status(404).json({
          success: false,
          message: "No courses found for the selected category.",
        })
      }
  
      // Get courses for other categories
      const categoriesExceptSelected = await Category.find({
        _id: { $ne: categoryId },
      })
      let differentCategory = await Category.findOne(
        categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
          ._id
      )
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec()
        //console.log("Different COURSE", differentCategory)
      // Get top-selling courses across all categories
      const allCategories = await Category.find()
        .populate({
          path: "courses",
          match: { status: "Published" },
          populate: {
            path: "instructor",
        },
        })
        .exec()
      const allCourses = allCategories.flatMap((category) => category.courses)
      const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10)
       // console.log("mostSellingCourses COURSE", mostSellingCourses)
      res.status(200).json({
        success: true,
        data: {
          selectedCategory,
          differentCategory,
          mostSellingCourses,
        },
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
  }











//  Create Tag

// User form → name + description bheja

// Validate kiya

// Agar duplicate nahi hai → DB me save

// Success response

//  Get All Tags

// DB se saare tags fetch

// Sirf name, description bheje frontend ko

//  Ab jab course create karte ho, tumne dekha hoga:

// const tagDetails = await Tag.findById(tag);


// Ye wahi tag hai jo pehle createTag se DB me save hua tha.
// Course aur Tag ka link isi wajah se banta hai → har course kisi ek/multiple tag(s) ke andar aa jata hai.


//  Tag Create Flow

// User ne form submit kiya jisme tag ka name aur description diya.

// Backend ne data fetch kiya req.body se.

// Backend ne validation kiya → agar name ya description missing hai to error.

// Backend ne DB check kiya → agar same tag already exist karta hai to error.

// Agar sab sahi hai → naya tag DB me save kar diya.

// Backend ne success response bhej diya frontend ko, ke tag ban gaya hai.

//  Show All Tags Flow

// Frontend ne request bheji → "mujhe saare tags chahiye".

// Backend ne DB me query kiya → "jitne bhi tags hain unko lao".

// Sirf name aur description fields select ki gayi (baaki fields ignore).

// Backend ne frontend ko saare tags list karke bhej diye.

// Simple Connect Flow

// Create Tag → Naya category ban gaya (ex: "Web Development").

// Show All Tags → Frontend ko tags list mil gayi.

// Create Course → Jab instructor course banata hai to ek tag select karta hai.

// Isse pata chal jaata hai ke kaunse course kis category (tag) me aata hai.