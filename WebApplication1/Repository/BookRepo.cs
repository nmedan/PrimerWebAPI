using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PripremaTest1.Models;
using PripremaTest1.Interfaces;
using System.Data.Entity;
namespace PripremaTest1.Repository
{

    public class BookRepo : IBookRepo
    {
        private ApplicationDbContext db = new ApplicationDbContext();
        public IEnumerable<Book> GetAll()
        {
            return db.Books.Include(x=>x.Author);
        }

        public Book GetById(int id)
        {
            var book = db.Books.Find(id);
            return book;
        }

        public void Add(Book book)
        {
            db.Books.Add(book);
            db.Entry(book).Reference(x => x.Author).Load();
            db.SaveChanges();
        }

        public void Edit(Book book)
        {
            db.Entry(book).State = EntityState.Modified;
            db.SaveChanges();
            db.Entry(book).Reference(x => x.Author).Load();
        }

        public void Delete(Book book)
        {
            db.Books.Remove(book);
            db.SaveChanges();
        }

        public IEnumerable<Book> GetByAuthor(int authorId)
        {
            return db.Books.Include(x => x.Author).Where(x => x.AuthorId == authorId).OrderBy(x => x.Title);
        }

        public bool BookExists(int id)
        {
            return db.Books.Count(x => x.Id == id) > 0;
        }
    }
}