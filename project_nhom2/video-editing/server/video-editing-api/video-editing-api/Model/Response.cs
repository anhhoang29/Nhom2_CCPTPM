using System.Collections.Generic;

namespace video_editing_api.Model
{
    public class Response<T>
    {
        private int v1;
        private string v2;
        //private List<object> roleNamesAndIds;

        public int Status { get; set; }
        public string Description { get; set; }
        public T Data { get; set; }

        public Response(int status, string description, T data)
        {
            Status = status;
            Description = description;
            Data = data;
        }

        public Response(int v1, string v2)
        {
            this.v1 = v1;
            this.v2 = v2;
           // this.roleNamesAndIds = roleNamesAndIds;
        }
    }
}
