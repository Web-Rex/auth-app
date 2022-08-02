// private route
exports.private = async (req, res, next) => 
{
    if (req.user.isverified === false) {
        return res.json({
            success: false, 
            details: "not authorised to access this rout pleas verify your number"
        });
    }

    res.json({
        success: true, 
        details: req.user
    });
}