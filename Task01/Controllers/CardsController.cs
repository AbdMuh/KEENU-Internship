using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task01.Model;
using UserApi.Services;

namespace Task01.Controllers
{
    [Route("[controller]")]
    [ApiController]
    //[Authorize]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;

        public CardsController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpGet("GetAllCards/{userId}")]

        public ActionResult<IEnumerable<UserCard>> GetAllCards(int userId)
        {
            var userCards = _cardService.GetAllCards(userId);

            if (!userCards.Any())
                return NotFound("No cards found for this user.");

            return Ok(userCards);
        }

        [HttpPost("add")]
        public ActionResult<UserCard> AddCard([FromBody] UserCard userCard)
        {
            if (userCard == null || userCard.UserId == 0 || string.IsNullOrWhiteSpace(userCard.CardNumber))
                return BadRequest("Invalid card data.");

            if(  (userCard.CardNumber).Length != 16)
            {
                return BadRequest("Card Number Should be 16 Digits Long");
            }

            var createdCard = _cardService.AddCard(userCard);
            return CreatedAtAction(nameof(GetAllCards), new { userId = createdCard.UserId }, createdCard);
        }

        [HttpPut("setDefault")]
        public IActionResult SetDefaultCard([FromBody] CardInfo cardInfo)
        {
            _cardService.SetDefaultCard(cardInfo.UserId, cardInfo.CardId);
            return Ok("Card display preference updated successfully.");
        }
        [HttpGet("getDefault/{userId}")]
        public ActionResult<UserCard> getDefault(int userId)
        {
           UserCard card = _cardService.GetDefaultCard(userId);
            return Ok(card);
        }
    }
}
