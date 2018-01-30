using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
namespace PripremaTest1.Models
{
    public class Book
    {
        public int Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public decimal Cena { get; set; }
        [Required]
        public DateTime DatePublished { get; set; }
        public int AuthorId { get; set; }
        public Author Author { get; set; }

        public Book()
        {

        }
      
    }
}